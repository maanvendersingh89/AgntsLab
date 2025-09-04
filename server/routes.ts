import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import multer from "multer";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertAgentSchema, insertContactMessageSchema } from "@shared/schema";

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('STRIPE_SECRET_KEY not found. Stripe functionality will be disabled.');
}

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
}) : null;

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Categories
  app.get('/api/categories', async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Agents
  app.get('/api/agents', async (req, res) => {
    try {
      const filters = {
        category: req.query.category as string,
        price: req.query.price as 'free' | 'paid',
        model: req.query.model as string,
        runtime: req.query.runtime as string,
        integration: req.query.integration as string,
        search: req.query.search as string,
      };

      // Remove undefined values
      Object.keys(filters).forEach(key => {
        if (filters[key as keyof typeof filters] === undefined || filters[key as keyof typeof filters] === '') {
          delete filters[key as keyof typeof filters];
        }
      });

      const agents = await storage.getAgents(Object.keys(filters).length > 0 ? filters : undefined);
      res.json(agents);
    } catch (error) {
      console.error("Error fetching agents:", error);
      res.status(500).json({ message: "Failed to fetch agents" });
    }
  });

  app.get('/api/agents/:id', async (req, res) => {
    try {
      const agentId = parseInt(req.params.id);
      const agent = await storage.getAgent(agentId);
      
      if (!agent) {
        return res.status(404).json({ message: "Agent not found" });
      }

      res.json(agent);
    } catch (error) {
      console.error("Error fetching agent:", error);
      res.status(500).json({ message: "Failed to fetch agent" });
    }
  });

  // Protected routes for vendors
  app.post('/api/agents', isAuthenticated, upload.single('file'), async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Mark user as vendor if not already
      await storage.upsertUser({ id: userId, isVendor: true });

      const agentData = insertAgentSchema.parse({
        ...req.body,
        vendorId: userId,
        price: req.body.isFree === 'true' ? '0.00' : req.body.price,
        isFree: req.body.isFree === 'true',
        categoryId: parseInt(req.body.categoryId),
      });

      const agent = await storage.createAgent(agentData);
      res.json(agent);
    } catch (error) {
      console.error("Error creating agent:", error);
      res.status(400).json({ message: "Failed to create agent" });
    }
  });

  app.get('/api/vendor/agents', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const agents = await storage.getAgentsByVendor(userId);
      res.json(agents);
    } catch (error) {
      console.error("Error fetching vendor agents:", error);
      res.status(500).json({ message: "Failed to fetch agents" });
    }
  });

  // Purchase and download
  app.post('/api/download/:agentId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const agentId = parseInt(req.params.agentId);
      
      const agent = await storage.getAgent(agentId);
      if (!agent) {
        return res.status(404).json({ message: "Agent not found" });
      }

      // Check if it's free or user has purchased
      if (!agent.isFree) {
        const hasPurchased = await storage.hasPurchased(userId, agentId);
        if (!hasPurchased) {
          return res.status(403).json({ message: "Purchase required" });
        }
      }

      // Increment download count
      await storage.incrementDownloadCount(agentId);

      // In a real implementation, you would serve the actual file here
      res.json({ 
        message: "Download initiated",
        downloadUrl: agent.downloadUrl || `/downloads/${agent.id}`,
      });
    } catch (error) {
      console.error("Error downloading agent:", error);
      res.status(500).json({ message: "Failed to download agent" });
    }
  });

  // Stripe payment routes
  if (stripe) {
    app.post("/api/create-payment-intent", isAuthenticated, async (req: any, res) => {
      try {
        const { agentId } = req.body;
        const userId = req.user.claims.sub;
        
        const agent = await storage.getAgent(agentId);
        if (!agent) {
          return res.status(404).json({ message: "Agent not found" });
        }

        if (agent.isFree) {
          return res.status(400).json({ message: "Agent is free" });
        }

        const amount = Math.round(parseFloat(agent.price) * 100); // Convert to cents

        const paymentIntent = await stripe.paymentIntents.create({
          amount,
          currency: "usd",
          metadata: {
            userId,
            agentId: agentId.toString(),
          },
        });

        // Create purchase record
        await storage.createPurchase({
          userId,
          agentId,
          amount: agent.price,
          stripePaymentIntentId: paymentIntent.id,
          status: 'pending',
        });

        res.json({ clientSecret: paymentIntent.client_secret });
      } catch (error: any) {
        console.error("Error creating payment intent:", error);
        res.status(500).json({ message: "Error creating payment intent: " + error.message });
      }
    });

    // Webhook to handle successful payments
    app.post('/api/webhook', async (req, res) => {
      const sig = req.headers['stripe-signature'];
      let event;

      try {
        event = stripe.webhooks.constructEvent(req.body, sig as string, process.env.STRIPE_WEBHOOK_SECRET!);
      } catch (err: any) {
        console.log(`Webhook signature verification failed.`, err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }

      if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;
        
        // Find purchase and update status
        const purchases = await storage.getPurchasesByUser(paymentIntent.metadata.userId);
        const purchase = purchases.find(p => p.stripePaymentIntentId === paymentIntent.id);
        
        if (purchase) {
          await storage.updatePurchaseStatus(purchase.id, 'completed');
        }
      }

      res.json({ received: true });
    });
  }

  // Contact form
  app.post('/api/contact', async (req, res) => {
    try {
      const messageData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(messageData);
      res.json({ message: "Message sent successfully", id: message.id });
    } catch (error) {
      console.error("Error creating contact message:", error);
      res.status(400).json({ message: "Failed to send message" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
