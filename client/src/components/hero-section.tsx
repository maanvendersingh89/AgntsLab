import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const handleBrowseAgents = () => {
    document.getElementById('agents')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleBecomeVendor = () => {
    document.getElementById('vendor')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero-bg py-20 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-robot text-primary text-3xl"></i>
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              <span className="gradient-text">Discover, Download & Build</span>
              <br />
              <span className="text-foreground">with AI Agents</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              The premier marketplace for AI agents. Find the perfect agent for your needs, or share your creations with the world.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleBrowseAgents}
              className="bg-primary text-primary-foreground px-8 py-4 rounded-lg hover:bg-primary/90 transition-all duration-200 font-semibold text-lg transform hover:scale-105"
              data-testid="button-browse-agents"
            >
              Browse Agents
            </Button>
            <Button
              onClick={handleBecomeVendor}
              variant="outline"
              className="bg-card border-2 border-primary text-primary px-8 py-4 rounded-lg hover:bg-primary hover:text-primary-foreground transition-all duration-200 font-semibold text-lg"
              data-testid="button-become-vendor"
            >
              Become a Vendor
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
