import { Twitter, Github, Linkedin, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-card/50 border-t border-border py-12">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <i className="fas fa-robot text-primary-foreground text-lg"></i>
              </div>
              <span className="text-xl font-bold gradient-text" data-testid="text-footer-logo">
                AgntsLab
              </span>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md" data-testid="text-footer-description">
              The premier marketplace for AI agents. Discover, download, and build with the latest AI technology from our community of developers.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
                data-testid="link-footer-twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
                data-testid="link-footer-github"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
                data-testid="link-footer-linkedin"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
                data-testid="link-footer-discord"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="link-footer-home"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#agents"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('agents')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="link-footer-browse"
                >
                  Browse Agents
                </a>
              </li>
              <li>
                <a
                  href="#vendor"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('vendor')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="link-footer-vendor"
                >
                  Become a Vendor
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="link-footer-contact"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="link-footer-docs"
                >
                  Documentation
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="link-footer-help"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="link-footer-privacy"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="link-footer-terms"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="link-footer-cookies"
                >
                  Cookie Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="link-footer-gdpr"
                >
                  GDPR
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm" data-testid="text-copyright">
            &copy; 2024 AgntsLab. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <span className="text-muted-foreground text-sm">Powered by</span>
            <div className="flex items-center space-x-2">
              <i className="fab fa-react text-primary"></i>
              <span className="text-sm font-medium">React & Express</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
