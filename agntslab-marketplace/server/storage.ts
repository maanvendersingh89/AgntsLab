import {
  users,
  agents,
  categories,
  purchases,
  reviews,
  contactMessages,
  type User,
  type UpsertUser,
  type Agent,
  type InsertAgent,
  type Category,
  type Purchase,
  type InsertPurchase,
  type Review,
  type InsertReview,
  type ContactMessage,
  type InsertContactMessage,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, ilike, or, sql } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserStripeInfo(userId: string, stripeCustomerId: string, stripeSubscriptionId?: string): Promise<User>;
  
  // Category operations
  getCategories(): Promise<Category[]>;
  createCategory(category: Omit<Category, 'id' | 'createdAt'>): Promise<Category>;
  
  // Agent operations
  getAgents(filters?: {
    category?: string;
    price?: 'free' | 'paid';
    model?: string;
    runtime?: string;
    integration?: string;
    search?: string;
  }): Promise<Agent[]>;
  getAgent(id: number): Promise<Agent | undefined>;
  getAgentsByVendor(vendorId: string): Promise<Agent[]>;
  createAgent(agent: InsertAgent): Promise<Agent>;
  updateAgent(id: number, agent: Partial<InsertAgent>): Promise<Agent>;
  incrementDownloadCount(agentId: number): Promise<void>;
  
  // Purchase operations
  createPurchase(purchase: InsertPurchase): Promise<Purchase>;
  getPurchase(id: number): Promise<Purchase | undefined>;
  getPurchasesByUser(userId: string): Promise<Purchase[]>;
  updatePurchaseStatus(id: number, status: string): Promise<Purchase>;
  hasPurchased(userId: string, agentId: number): Promise<boolean>;
  
  // Review operations
  createReview(review: InsertReview): Promise<Review>;
  getReviewsByAgent(agentId: number): Promise<Review[]>;
  
  // Contact operations
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserStripeInfo(userId: string, stripeCustomerId: string, stripeSubscriptionId?: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        stripeCustomerId,
        stripeSubscriptionId,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories).orderBy(categories.name);
  }

  async createCategory(categoryData: Omit<Category, 'id' | 'createdAt'>): Promise<Category> {
    const [category] = await db.insert(categories).values(categoryData).returning();
    return category;
  }

  // Agent operations
  async getAgents(filters?: {
    category?: string;
    price?: 'free' | 'paid';
    model?: string;
    runtime?: string;
    integration?: string;
    search?: string;
  }): Promise<Agent[]> {
    const conditions = [eq(agents.isActive, true)];

    if (filters) {
      if (filters.category) {
        conditions.push(eq(agents.categoryId, parseInt(filters.category)));
      }

      if (filters.price === 'free') {
        conditions.push(eq(agents.isFree, true));
      } else if (filters.price === 'paid') {
        conditions.push(eq(agents.isFree, false));
      }

      if (filters.model) {
        conditions.push(ilike(agents.model, `%${filters.model}%`));
      }

      if (filters.runtime) {
        conditions.push(ilike(agents.runtime, `%${filters.runtime}%`));
      }

      if (filters.integration) {
        conditions.push(ilike(agents.integration, `%${filters.integration}%`));
      }

      if (filters.search) {
        conditions.push(
          or(
            ilike(agents.name, `%${filters.search}%`),
            ilike(agents.description, `%${filters.search}%`)
          )!
        );
      }
    }

    return await db.select().from(agents).where(and(...conditions)).orderBy(desc(agents.createdAt));
  }

  async getAgent(id: number): Promise<Agent | undefined> {
    const [agent] = await db.select().from(agents).where(eq(agents.id, id));
    return agent;
  }

  async getAgentsByVendor(vendorId: string): Promise<Agent[]> {
    return await db
      .select()
      .from(agents)
      .where(eq(agents.vendorId, vendorId))
      .orderBy(desc(agents.createdAt));
  }

  async createAgent(agentData: InsertAgent): Promise<Agent> {
    const [agent] = await db.insert(agents).values(agentData).returning();
    return agent;
  }

  async updateAgent(id: number, agentData: Partial<InsertAgent>): Promise<Agent> {
    const [agent] = await db
      .update(agents)
      .set({ ...agentData, updatedAt: new Date() })
      .where(eq(agents.id, id))
      .returning();
    return agent;
  }

  async incrementDownloadCount(agentId: number): Promise<void> {
    await db
      .update(agents)
      .set({
        downloadCount: sql`${agents.downloadCount} + 1`,
      })
      .where(eq(agents.id, agentId));
  }

  // Purchase operations
  async createPurchase(purchaseData: InsertPurchase): Promise<Purchase> {
    const [purchase] = await db.insert(purchases).values(purchaseData).returning();
    return purchase;
  }

  async getPurchase(id: number): Promise<Purchase | undefined> {
    const [purchase] = await db.select().from(purchases).where(eq(purchases.id, id));
    return purchase;
  }

  async getPurchasesByUser(userId: string): Promise<Purchase[]> {
    return await db
      .select()
      .from(purchases)
      .where(eq(purchases.userId, userId))
      .orderBy(desc(purchases.createdAt));
  }

  async updatePurchaseStatus(id: number, status: string): Promise<Purchase> {
    const [purchase] = await db
      .update(purchases)
      .set({ status })
      .where(eq(purchases.id, id))
      .returning();
    return purchase;
  }

  async hasPurchased(userId: string, agentId: number): Promise<boolean> {
    const [purchase] = await db
      .select()
      .from(purchases)
      .where(
        and(
          eq(purchases.userId, userId),
          eq(purchases.agentId, agentId),
          eq(purchases.status, 'completed')
        )
      )
      .limit(1);
    return !!purchase;
  }

  // Review operations
  async createReview(reviewData: InsertReview): Promise<Review> {
    const [review] = await db.insert(reviews).values(reviewData).returning();
    return review;
  }

  async getReviewsByAgent(agentId: number): Promise<Review[]> {
    return await db
      .select()
      .from(reviews)
      .where(eq(reviews.agentId, agentId))
      .orderBy(desc(reviews.createdAt));
  }

  // Contact operations
  async createContactMessage(messageData: InsertContactMessage): Promise<ContactMessage> {
    const [message] = await db.insert(contactMessages).values(messageData).returning();
    return message;
  }
}

export const storage = new DatabaseStorage();
