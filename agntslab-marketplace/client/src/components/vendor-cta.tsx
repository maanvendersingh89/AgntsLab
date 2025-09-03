import { Button } from "@/components/ui/button";
import { Upload, DollarSign, TrendingUp } from "lucide-react";

export default function VendorCTA() {
  const handleStartSelling = () => {
    window.location.href = '/api/login';
  };

  const handleLearnMore = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="vendor" className="py-20 bg-card/50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <img
            src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
            alt="Vendor Dashboard"
            className="w-full h-64 object-cover rounded-xl mb-8"
            data-testid="img-vendor-dashboard"
          />
          
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            <span className="gradient-text">Share Your AI Agents</span>
            <br />
            <span className="text-foreground">with the World</span>
          </h2>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of developers monetizing their AI creations. Our platform provides all the tools you need to succeed.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Upload className="text-primary text-2xl" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Easy Upload</h3>
              <p className="text-muted-foreground">
                Simple process to list your agents with comprehensive documentation tools.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <DollarSign className="text-primary text-2xl" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Flexible Pricing</h3>
              <p className="text-muted-foreground">
                Set your own prices or offer agents for free to build your reputation.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="text-primary text-2xl" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Analytics Dashboard</h3>
              <p className="text-muted-foreground">
                Track downloads, earnings, and user feedback with detailed insights.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleStartSelling}
              className="bg-primary text-primary-foreground px-8 py-4 rounded-lg hover:bg-primary/90 transition-all duration-200 font-semibold text-lg transform hover:scale-105"
              data-testid="button-start-selling"
            >
              Start Selling Today
            </Button>
            <Button
              onClick={handleLearnMore}
              variant="outline"
              className="bg-card border-2 border-primary text-primary px-8 py-4 rounded-lg hover:bg-primary hover:text-primary-foreground transition-all duration-200 font-semibold text-lg"
              data-testid="button-learn-more"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
