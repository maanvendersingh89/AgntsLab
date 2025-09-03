import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AgentCard from "@/components/agent-card";
import FilterBar from "./filter-bar";
import { Button } from "@/components/ui/button";
import type { Agent } from "@shared/schema";

export default function AgentGrid() {
  const [filters, setFilters] = useState<{
    category?: string;
    price?: 'free' | 'paid';
    model?: string;
    runtime?: string;
    integration?: string;
  }>({});

  const { data: agents = [], isLoading } = useQuery<Agent[]>({
    queryKey: ["/api/agents", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          params.append(key, value);
        }
      });

      const response = await fetch(`/api/agents?${params}`, {
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch agents');
      }
      
      return response.json();
    },
  });

  return (
    <>
      <FilterBar onFiltersChange={setFilters} agentCount={agents.length} />
      
      <section id="agents" className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Featured AI Agents</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Discover powerful AI agents created by our community of developers and researchers
            </p>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="bg-card border border-border rounded-xl overflow-hidden animate-pulse"
                  data-testid="skeleton-agent-card"
                >
                  <div className="w-full h-48 bg-muted"></div>
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="h-4 bg-muted rounded w-24"></div>
                      <div className="h-6 bg-muted rounded w-16"></div>
                    </div>
                    <div className="h-6 bg-muted rounded w-3/4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-full"></div>
                      <div className="h-4 bg-muted rounded w-2/3"></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="h-4 bg-muted rounded w-20"></div>
                      <div className="h-4 bg-muted rounded w-24"></div>
                    </div>
                    <div className="h-10 bg-muted rounded w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : agents.length === 0 ? (
            <div className="text-center py-12" data-testid="text-no-agents-found">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-search text-muted-foreground text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">No agents found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters or check back later for new agents.
              </p>
              <Button
                onClick={() => setFilters({})}
                variant="outline"
                data-testid="button-clear-filters"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" data-testid="grid-agents">
                {agents.map((agent) => (
                  <AgentCard key={agent.id} agent={agent} />
                ))}
              </div>
              
              {agents.length >= 20 && (
                <div className="text-center mt-12">
                  <Button
                    variant="outline"
                    className="bg-card border border-border text-foreground hover:bg-muted"
                    data-testid="button-load-more"
                  >
                    Load More Agents
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
