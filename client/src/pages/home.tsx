import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/header";
import FilterBar from "@/components/filter-bar";
import AgentGrid from "@/components/agent-grid";
import VendorCTA from "@/components/vendor-cta";
import ContactForm from "@/components/contact-form";
import Footer from "@/components/footer";

export default function Home() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      {/* Welcome banner for authenticated users */}
      <div className="bg-primary/10 border-b border-primary/20 py-4">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-primary">Welcome back!</h2>
              <p className="text-sm text-muted-foreground">Discover new AI agents and manage your collection</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => window.location.href = '/vendor'}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                data-testid="button-vendor-dashboard"
              >
                Vendor Dashboard
              </button>
              <button
                onClick={() => window.location.href = '/api/logout'}
                className="border border-primary text-primary px-4 py-2 rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors"
                data-testid="button-logout"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      <FilterBar />
      <AgentGrid />
      <VendorCTA />
      <ContactForm />
      <Footer />
    </div>
  );
}
