import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { useParams } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import type { Agent } from "@shared/schema";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  console.warn('Missing Stripe public key. Payment functionality will not work.');
}

const stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY 
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
  : null;

const CheckoutForm = ({ agent }: { agent: Agent }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    if (!stripe || !elements) {
      setIsProcessing(false);
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/?purchase=success`,
      },
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Payment Successful",
        description: "Thank you for your purchase!",
      });
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button
        type="submit"
        disabled={!stripe || !elements || isProcessing}
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
        data-testid="button-complete-payment"
      >
        {isProcessing ? (
          <>
            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
            Processing...
          </>
        ) : (
          `Pay $${agent.price}`
        )}
      </Button>
    </form>
  );
};

export default function Checkout() {
  const { agentId } = useParams();
  const { toast } = useToast();
  const [clientSecret, setClientSecret] = useState("");

  // Fetch agent details
  const { data: agent, isLoading } = useQuery<Agent>({
    queryKey: [`/api/agents/${agentId}`],
    enabled: !!agentId,
  });

  useEffect(() => {
    if (!agent || !agentId) return;

    if (agent.isFree) {
      toast({
        title: "Agent is Free",
        description: "This agent is available for free download",
      });
      window.location.href = '/';
      return;
    }

    // Create PaymentIntent as soon as the agent loads
    apiRequest("POST", "/api/create-payment-intent", { agentId: parseInt(agentId) })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
      })
      .catch((error) => {
        console.error('Error creating payment intent:', error);
        toast({
          title: "Error",
          description: "Failed to initialize payment",
          variant: "destructive",
        });
      });
  }, [agent, agentId, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">Agent not found</p>
            <Button
              onClick={() => window.location.href = '/'}
              className="mt-4"
              data-testid="button-back-to-home"
            >
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!stripePromise) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">Payment system not configured</p>
            <Button
              onClick={() => window.location.href = '/'}
              className="mt-4"
              data-testid="button-back-to-home"
            >
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Initializing payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => window.location.href = '/'}
            className="text-muted-foreground hover:text-foreground mb-4"
            data-testid="button-back-home"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Marketplace
          </Button>
          <h1 className="text-3xl font-bold">Complete Purchase</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Agent Details */}
          <Card>
            <CardHeader>
              <CardTitle>Agent Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {agent.imageUrl && (
                <img
                  src={agent.imageUrl}
                  alt={agent.name}
                  className="w-full h-48 object-cover rounded-lg"
                  data-testid="img-agent-preview"
                />
              )}
              <div>
                <h3 className="font-semibold text-lg" data-testid="text-agent-name">
                  {agent.name}
                </h3>
                <p className="text-muted-foreground" data-testid="text-agent-description">
                  {agent.shortDescription || agent.description}
                </p>
              </div>
              <div className="flex items-center justify-between pt-4 border-t">
                <span className="font-semibold">Total:</span>
                <span className="text-2xl font-bold text-primary" data-testid="text-agent-price">
                  ${agent.price}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Payment Form */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
            </CardHeader>
            <CardContent>
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm agent={agent} />
              </Elements>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
