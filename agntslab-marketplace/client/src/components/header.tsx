import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Search, ShoppingCart } from "lucide-react";

export default function Header() {
  const { isAuthenticated, user } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <i className="fas fa-robot text-primary-foreground text-lg"></i>
            </div>
            <span className="text-xl font-bold gradient-text" data-testid="text-logo">
              AgntsLab
            </span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a 
              href="#" 
              className="text-muted-foreground hover:text-foreground transition-colors"
              data-testid="link-home"
            >
              Home
            </a>
            <a 
              href="#agents" 
              className="text-muted-foreground hover:text-foreground transition-colors"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('agents')?.scrollIntoView({ behavior: 'smooth' });
              }}
              data-testid="link-browse-agents"
            >
              Browse Agents
            </a>
            <a 
              href="#vendor" 
              className="text-muted-foreground hover:text-foreground transition-colors"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('vendor')?.scrollIntoView({ behavior: 'smooth' });
              }}
              data-testid="link-become-vendor"
            >
              Become a Vendor
            </a>
            <a 
              href="#contact" 
              className="text-muted-foreground hover:text-foreground transition-colors"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
              data-testid="link-contact"
            >
              Contact
            </a>
          </nav>
          
          <div className="flex items-center space-x-4">
            <button 
              className="text-muted-foreground hover:text-foreground transition-colors"
              data-testid="button-search"
            >
              <Search className="w-5 h-5" />
            </button>
            <button 
              className="text-muted-foreground hover:text-foreground transition-colors"
              data-testid="button-cart"
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                {user?.profileImageUrl && (
                  <img
                    src={user.profileImageUrl}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover"
                    data-testid="img-user-avatar"
                  />
                )}
                <Button
                  onClick={() => window.location.href = '/api/logout'}
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  data-testid="button-sign-out"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => window.location.href = '/api/login'}
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
                data-testid="button-sign-in"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
