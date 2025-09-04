import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Plus, Upload } from "lucide-react";
import type { Agent, Category } from "@shared/schema";

export default function VendorDashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const queryClient = useQueryClient();
  const [showNewAgentForm, setShowNewAgentForm] = useState(false);

  // Redirect to login if not authenticated
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

  // Fetch vendor's agents
  const { data: agents = [], isLoading: agentsLoading } = useQuery<Agent[]>({
    queryKey: ["/api/vendor/agents"],
    enabled: isAuthenticated,
  });

  // Fetch categories for form
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  // Create agent mutation
  const createAgentMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch('/api/agents', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error(`${response.status}: ${await response.text()}`);
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vendor/agents"] });
      setShowNewAgentForm(false);
      toast({
        title: "Success",
        description: "Agent created successfully!",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Error",
        description: "Failed to create agent",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    createAgentMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border bg-card/50">
        <div className="container mx-auto px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => window.location.href = '/'}
                className="text-muted-foreground hover:text-foreground"
                data-testid="button-back-home"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Vendor Dashboard</h1>
                <p className="text-muted-foreground">Manage your AI agents</p>
              </div>
            </div>
            <Button
              onClick={() => setShowNewAgentForm(!showNewAgentForm)}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              data-testid="button-new-agent"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Agent
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-8">
        {showNewAgentForm && (
          <Card className="mb-8" data-testid="card-new-agent-form">
            <CardHeader>
              <CardTitle>Create New Agent</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Agent Name</Label>
                    <Input
                      id="name"
                      name="name"
                      required
                      placeholder="Enter agent name"
                      data-testid="input-agent-name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="categoryId">Category</Label>
                    <Select name="categoryId" required>
                      <SelectTrigger data-testid="select-category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="model">Model</Label>
                    <Input
                      id="model"
                      name="model"
                      placeholder="e.g., GPT-4, Claude, Custom"
                      data-testid="input-model"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="runtime">Runtime</Label>
                    <Input
                      id="runtime"
                      name="runtime"
                      placeholder="e.g., Python, JavaScript, Docker"
                      data-testid="input-runtime"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="integration">Integration</Label>
                    <Input
                      id="integration"
                      name="integration"
                      placeholder="e.g., API, Webhook, Plugin"
                      data-testid="input-integration"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="imageUrl">Image URL</Label>
                    <Input
                      id="imageUrl"
                      name="imageUrl"
                      placeholder="https://example.com/image.jpg"
                      data-testid="input-image-url"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shortDescription">Short Description</Label>
                  <Input
                    id="shortDescription"
                    name="shortDescription"
                    placeholder="Brief description for the agent card"
                    maxLength={300}
                    data-testid="input-short-description"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Full Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    required
                    placeholder="Detailed description of your agent"
                    rows={4}
                    data-testid="textarea-description"
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isFree"
                      name="isFree"
                      data-testid="switch-is-free"
                    />
                    <Label htmlFor="isFree">Free Agent</Label>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Price (if not free)</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      data-testid="input-price"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="file">Agent File (optional)</Label>
                  <Input
                    id="file"
                    name="file"
                    type="file"
                    data-testid="input-agent-file"
                  />
                </div>

                <div className="flex space-x-4">
                  <Button
                    type="submit"
                    disabled={createAgentMutation.isPending}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                    data-testid="button-submit-agent"
                  >
                    {createAgentMutation.isPending ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Create Agent
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowNewAgentForm(false)}
                    data-testid="button-cancel-agent"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Agents List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Agents</CardTitle>
          </CardHeader>
          <CardContent>
            {agentsLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin w-6 h-6 border-4 border-primary border-t-transparent rounded-full" />
              </div>
            ) : agents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground" data-testid="text-no-agents">
                <p>No agents created yet.</p>
                <p>Click "New Agent" to get started!</p>
              </div>
            ) : (
              <div className="space-y-4" data-testid="list-vendor-agents">
                {agents.map((agent) => (
                  <div
                    key={agent.id}
                    className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                    data-testid={`card-agent-${agent.id}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg" data-testid={`text-agent-name-${agent.id}`}>
                          {agent.name}
                        </h3>
                        <p className="text-muted-foreground mb-2" data-testid={`text-agent-description-${agent.id}`}>
                          {agent.shortDescription || agent.description}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            agent.isFree
                              ? 'bg-primary/20 text-primary'
                              : 'bg-secondary/20 text-secondary'
                          }`}>
                            {agent.isFree ? 'FREE' : `$${agent.price}`}
                          </span>
                          <span data-testid={`text-downloads-${agent.id}`}>
                            {agent.downloadCount} downloads
                          </span>
                          <span data-testid={`text-rating-${agent.id}`}>
                            ⭐ {agent.rating} ({agent.reviewCount} reviews)
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          data-testid={`button-edit-${agent.id}`}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          data-testid={`button-analytics-${agent.id}`}
                        >
                          Analytics
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
