import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Star, DollarSign } from "lucide-react";
import type { Agent } from "@shared/schema";

interface AgentCardProps {
  agent: Agent;
}

export default function AgentCard({ agent }: AgentCardProps) {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Default image for agents without custom images
  const getAgentImage = (agent: Agent) => {
    if (agent.imageUrl) return agent.imageUrl;
    
    // Return different stock images based on category or name hash
    const images = [
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
      "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
      "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
    ];
    
    return images[agent.id % images.length];
  };

  const downloadMutation = useMutation({
    mutationFn: async (agentId: number) => {
      return await apiRequest("POST", `/api/download/${agentId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/agents"] });
      toast({
        title: "Download Started",
        description: "Your agent download has begun!",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Sign In Required",
          description: "Please sign in to download agents",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      
      if (error.message.includes('Purchase required')) {
        toast({
          title: "Purchase Required",
          description: "This agent requires purchase before download",
        });
        return;
      }
      
      toast({
        title: "Download Failed",
        description: "Failed to download agent",
        variant: "destructive",
      });
    },
  });

  const handleDownload = () => {
    if (!isAuthenticated) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to download agents",
      });
      window.location.href = "/api/login";
      return;
    }

    if (!agent.isFree) {
      // Redirect to checkout page for paid agents
      window.location.href = `/checkout/${agent.id}`;
      return;
    }

    downloadMutation.mutate(agent.id);
  };

  const getCategoryColor = (categoryId: number | null) => {
    const colors = [
      'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
    ];
    
    if (!categoryId) return colors[0];
    return colors[categoryId % colors.length];
  };

  return (
    <div
      className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-200 hover:transform hover:scale-105"
      data-testid={`card-agent-${agent.id}`}
    >
      <img
        src={getAgentImage(agent)}
        alt={agent.name}
        className="w-full h-48 object-cover"
        data-testid={`img-agent-${agent.id}`}
      />
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <Badge
            variant="secondary"
            className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(agent.categoryId)}`}
            data-testid={`badge-category-${agent.id}`}
          >
            {agent.categoryId ? `Category ${agent.categoryId}` : 'Uncategorized'}
          </Badge>
          
          {agent.isFree ? (
            <Badge
              className="bg-primary/20 text-primary px-2 py-1 rounded-full text-xs font-bold"
              data-testid={`badge-price-${agent.id}`}
            >
              FREE
            </Badge>
          ) : (
            <span
              className="text-lg font-bold text-primary flex items-center"
              data-testid={`text-price-${agent.id}`}
            >
              <DollarSign className="w-4 h-4" />
              {agent.price}
            </span>
          )}
        </div>
        
        <h3
          className="text-lg font-semibold mb-2 line-clamp-1"
          data-testid={`text-name-${agent.id}`}
        >
          {agent.name}
        </h3>
        
        <p
          className="text-muted-foreground text-sm mb-4 line-clamp-2"
          data-testid={`text-description-${agent.id}`}
        >
          {agent.shortDescription || agent.description}
        </p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium" data-testid={`text-rating-${agent.id}`}>
              {parseFloat(agent.rating || '0').toFixed(1)}
            </span>
            <span className="text-muted-foreground text-sm" data-testid={`text-review-count-${agent.id}`}>
              ({agent.reviewCount})
            </span>
          </div>
          
          <span className="text-muted-foreground text-sm flex items-center" data-testid={`text-downloads-${agent.id}`}>
            <Download className="w-4 h-4 mr-1" />
            {agent.downloadCount?.toLocaleString() || 0}
          </span>
        </div>
        
        <Button
          onClick={handleDownload}
          disabled={downloadMutation.isPending}
          className={`w-full ${
            agent.isFree
              ? 'bg-primary text-primary-foreground hover:bg-primary/90'
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/90'
          } transition-colors font-medium`}
          data-testid={`button-download-${agent.id}`}
        >
          {downloadMutation.isPending ? (
            <>
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
              Processing...
            </>
          ) : agent.isFree ? (
            <>
              <Download className="w-4 h-4 mr-2" />
              Download Free
            </>
          ) : (
            <>
              <DollarSign className="w-4 h-4 mr-2" />
              Purchase
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
