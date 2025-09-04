import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { Category } from "@shared/schema";

interface FilterBarProps {
  onFiltersChange?: (filters: {
    category?: string;
    price?: 'free' | 'paid';
    model?: string;
    runtime?: string;
    integration?: string;
  }) => void;
  agentCount?: number;
}

export default function FilterBar({ onFiltersChange, agentCount }: FilterBarProps) {
  const [filters, setFilters] = useState({
    category: '',
    price: '',
    model: '',
    runtime: '',
    integration: '',
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value === 'all' ? '' : value };
    setFilters(newFilters);
    
    // Convert empty strings to undefined for the API
    const apiFilters = Object.fromEntries(
      Object.entries(newFilters).map(([k, v]) => [k, v || undefined])
    );
    
    onFiltersChange?.(apiFilters);
  };

  const handleApplyFilters = () => {
    const apiFilters = Object.fromEntries(
      Object.entries(filters).map(([k, v]) => [k, v || undefined])
    );
    onFiltersChange?.(apiFilters);
  };

  return (
    <section className="py-8 bg-card/50" id="filters">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="bg-card border border-border rounded-xl p-6 filter-shadow">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div>
              <Label className="block text-sm font-medium text-muted-foreground mb-2">
                Category
              </Label>
              <Select
                value={filters.category}
                onValueChange={(value) => handleFilterChange('category', value)}
                data-testid="select-filter-category"
              >
                <SelectTrigger className="w-full bg-input border border-border rounded-lg text-foreground focus:ring-2 focus:ring-ring focus:border-transparent">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="block text-sm font-medium text-muted-foreground mb-2">
                Price
              </Label>
              <Select
                value={filters.price}
                onValueChange={(value) => handleFilterChange('price', value)}
                data-testid="select-filter-price"
              >
                <SelectTrigger className="w-full bg-input border border-border rounded-lg text-foreground focus:ring-2 focus:ring-ring focus:border-transparent">
                  <SelectValue placeholder="All Prices" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="block text-sm font-medium text-muted-foreground mb-2">
                Model
              </Label>
              <Select
                value={filters.model}
                onValueChange={(value) => handleFilterChange('model', value)}
                data-testid="select-filter-model"
              >
                <SelectTrigger className="w-full bg-input border border-border rounded-lg text-foreground focus:ring-2 focus:ring-ring focus:border-transparent">
                  <SelectValue placeholder="All Models" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Models</SelectItem>
                  <SelectItem value="GPT-4">GPT-4</SelectItem>
                  <SelectItem value="Claude">Claude</SelectItem>
                  <SelectItem value="LLaMA">LLaMA</SelectItem>
                  <SelectItem value="Custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="block text-sm font-medium text-muted-foreground mb-2">
                Runtime
              </Label>
              <Select
                value={filters.runtime}
                onValueChange={(value) => handleFilterChange('runtime', value)}
                data-testid="select-filter-runtime"
              >
                <SelectTrigger className="w-full bg-input border border-border rounded-lg text-foreground focus:ring-2 focus:ring-ring focus:border-transparent">
                  <SelectValue placeholder="All Runtimes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Runtimes</SelectItem>
                  <SelectItem value="Python">Python</SelectItem>
                  <SelectItem value="JavaScript">JavaScript</SelectItem>
                  <SelectItem value="Docker">Docker</SelectItem>
                  <SelectItem value="Cloud">Cloud</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="block text-sm font-medium text-muted-foreground mb-2">
                Integration
              </Label>
              <Select
                value={filters.integration}
                onValueChange={(value) => handleFilterChange('integration', value)}
                data-testid="select-filter-integration"
              >
                <SelectTrigger className="w-full bg-input border border-border rounded-lg text-foreground focus:ring-2 focus:ring-ring focus:border-transparent">
                  <SelectValue placeholder="All Integrations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Integrations</SelectItem>
                  <SelectItem value="API">API</SelectItem>
                  <SelectItem value="Webhook">Webhook</SelectItem>
                  <SelectItem value="Plugin">Plugin</SelectItem>
                  <SelectItem value="Standalone">Standalone</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-6">
            <span className="text-muted-foreground" data-testid="text-agent-count">
              {agentCount !== undefined ? `Showing ${agentCount} agents` : 'Loading agents...'}
            </span>
            <Button
              onClick={handleApplyFilters}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors font-medium"
              data-testid="button-apply-filters"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
