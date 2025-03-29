import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BadgeIcon } from "@/components/ui/badge-icon";
import { Separator } from "@/components/ui/separator";
import LoadingState from "@/components/shared/LoadingState";
import EmptyState from "@/components/shared/EmptyState";
import { LearningResource } from "@/types";
import { chatWithBusinessAssistant } from "@/lib/openai";
import { Helmet } from "react-helmet";

const ResourceCard = ({ resource }: { resource: LearningResource }) => {
  // Get icon based on resource type
  const getIcon = (type: string) => {
    switch (type) {
      case 'video':
        return 'ri-video-line';
      case 'article':
        return 'ri-file-text-line';
      case 'guide':
        return 'ri-book-open-line';
      default:
        return 'ri-file-line';
    }
  };
  
  // Get color based on resource type
  const getColor = (type: string) => {
    switch (type) {
      case 'video':
        return 'primary';
      case 'article':
        return 'accent';
      case 'guide':
        return 'secondary';
      default:
        return 'primary';
    }
  };
  
  // Get background color based on level
  const getLevelBg = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-success bg-opacity-10 text-success';
      case 'intermediate':
        return 'bg-warning bg-opacity-10 text-warning';
      case 'advanced':
        return 'bg-primary bg-opacity-10 text-primary';
      default:
        return 'bg-neutral-lightest text-neutral-medium';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <BadgeIcon
            icon={getIcon(resource.type)}
            color={getColor(resource.type)}
            className="mt-1"
          />
          <div>
            <h3 className="font-medium text-lg mb-1">{resource.title}</h3>
            <div className="flex items-center mb-2">
              <span className="bg-neutral-lightest text-neutral-medium text-xs px-2 py-0.5 rounded">
                {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
              </span>
              <span className={`ml-2 ${getLevelBg(resource.level)} text-xs px-2 py-0.5 rounded`}>
                {resource.level.charAt(0).toUpperCase() + resource.level.slice(1)}
              </span>
              <span className="ml-2 text-neutral-medium text-xs">
                {resource.duration} min
              </span>
            </div>
            <p className="text-sm text-neutral-medium mb-4">
              {resource.description}
            </p>
            <Button size="sm" className={`bg-${getColor(resource.type)} hover:bg-${getColor(resource.type)}-dark text-white`}>
              {resource.type === 'video' ? 'Watch Now' : 'Read Now'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const LearningHubPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);
  const [conversation, setConversation] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  
  const { data: learningResources, isLoading } = useQuery({
    queryKey: ['/api/learning-resources'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/learning-resources', undefined);
      return res.json() as Promise<LearningResource[]>;
    }
  });

  // Filter resources based on search query, level, and type
  const filteredResources = learningResources?.filter(resource => {
    const matchesSearch = 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLevel = levelFilter === "all" || resource.level === levelFilter;
    const matchesType = typeFilter === "all" || resource.type === typeFilter;
    
    return matchesSearch && matchesLevel && matchesType;
  });

  // Handle AI assistant question
  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuestion.trim() || isLoadingResponse) return;
    
    // Add user question to conversation
    const updatedConversation = [
      ...conversation,
      { role: "user", content: aiQuestion }
    ];
    setConversation(updatedConversation);
    
    setIsLoadingResponse(true);
    try {
      // Get AI response
      const response = await chatWithBusinessAssistant(updatedConversation, aiQuestion);
      
      // Add assistant response to conversation
      setConversation([
        ...updatedConversation,
        { role: "assistant", content: response }
      ]);
      
      setAiResponse(response);
    } catch (error) {
      console.error('Error asking AI:', error);
      setAiResponse("Sorry, I couldn't process your question at this time. Please try again later.");
      
      // Add error response to conversation
      setConversation([
        ...updatedConversation,
        { role: "assistant", content: "Sorry, I couldn't process your question at this time. Please try again later." }
      ]);
    } finally {
      setIsLoadingResponse(false);
      setAiQuestion("");
    }
  };

  return (
    <>
      <Helmet>
        <title>Learning Hub | SheTrade Connect</title>
        <link href="https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.css" rel="stylesheet" />
      </Helmet>

      <div className="mb-8">
        <h1 className="font-display font-bold text-2xl md:text-3xl text-neutral-dark mb-2">
          Learning Hub
        </h1>
        <p className="text-neutral-medium">
          Develop your business skills with bite-sized courses, guides, and resources
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2">
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <i className="ri-search-line text-neutral-medium"></i>
                </div>
                <Input
                  type="search"
                  className="pl-10 pr-4 py-2 w-full"
                  placeholder="Search for topics, skills, or resources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select 
                className="flex h-10 rounded-md border border-neutral-light bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-light"
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
              
              <select 
                className="flex h-10 rounded-md border border-neutral-light bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-light"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="video">Videos</option>
                <option value="article">Articles</option>
                <option value="guide">Guides</option>
              </select>
            </div>
          </div>

          <Tabs defaultValue="all" className="mb-6">
            <TabsList>
              <TabsTrigger value="all">All Resources</TabsTrigger>
              <TabsTrigger value="recommended">Recommended</TabsTrigger>
              <TabsTrigger value="popular">Most Popular</TabsTrigger>
              <TabsTrigger value="saved">Saved</TabsTrigger>
            </TabsList>
          </Tabs>

          {isLoading ? (
            <LoadingState type="card" count={6} />
          ) : filteredResources && filteredResources.length > 0 ? (
            <div className="space-y-4">
              {filteredResources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No resources found"
              description="Try adjusting your search criteria or check back later for new resources."
              icon="ri-book-open-line"
            />
          )}
        </div>
        
        <div>
          <Card>
            <CardContent className="p-6">
              <h3 className="font-medium text-lg mb-4">AI Business Assistant</h3>
              <p className="text-sm text-neutral-medium mb-4">
                Ask any business question and get personalized advice to help you grow your business.
              </p>
              
              {conversation.length > 0 && (
                <div className="mb-4 space-y-3">
                  {conversation.map((msg, index) => (
                    <div key={index} className={`p-3 rounded-lg ${
                      msg.role === 'user' 
                        ? 'bg-primary text-white ml-4' 
                        : 'bg-neutral-lightest border border-neutral-light mr-4'
                    }`}>
                      <p className="text-sm">{msg.content}</p>
                    </div>
                  ))}
                </div>
              )}
              
              <form onSubmit={handleAskQuestion} className="flex items-center">
                <Input 
                  type="text" 
                  className="flex-1 border border-neutral-light rounded-l-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary" 
                  placeholder="Ask a question..."
                  value={aiQuestion}
                  onChange={(e) => setAiQuestion(e.target.value)}
                  disabled={isLoadingResponse}
                />
                <Button 
                  type="submit"
                  className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-r-lg"
                  disabled={isLoadingResponse || !aiQuestion.trim()}
                >
                  {isLoadingResponse ? (
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-white animate-bounce"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                    </div>
                  ) : (
                    <i className="ri-send-plane-fill"></i>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardContent className="p-6">
              <h3 className="font-medium text-lg mb-4">Popular Topics</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline" className="bg-neutral-lightest hover:bg-neutral-light cursor-pointer">
                  Digital Marketing
                </Badge>
                <Badge variant="outline" className="bg-neutral-lightest hover:bg-neutral-light cursor-pointer">
                  Export Regulations
                </Badge>
                <Badge variant="outline" className="bg-neutral-lightest hover:bg-neutral-light cursor-pointer">
                  Supply Chain
                </Badge>
                <Badge variant="outline" className="bg-neutral-lightest hover:bg-neutral-light cursor-pointer">
                  Business Finance
                </Badge>
                <Badge variant="outline" className="bg-neutral-lightest hover:bg-neutral-light cursor-pointer">
                  E-commerce
                </Badge>
                <Badge variant="outline" className="bg-neutral-lightest hover:bg-neutral-light cursor-pointer">
                  Product Photography
                </Badge>
                <Badge variant="outline" className="bg-neutral-lightest hover:bg-neutral-light cursor-pointer">
                  SEO
                </Badge>
                <Badge variant="outline" className="bg-neutral-lightest hover:bg-neutral-light cursor-pointer">
                  Negotiation
                </Badge>
              </div>
              
              <h3 className="font-medium text-lg mb-4">Learning Paths</h3>
              <div className="space-y-3">
                <div className="p-3 border border-neutral-light rounded-lg">
                  <h4 className="font-medium">Digital Marketing Fundamentals</h4>
                  <p className="text-sm text-neutral-medium mb-2">5 courses • 2 hours total</p>
                  <div className="relative h-2 w-full bg-neutral-light rounded-full mb-1">
                    <div className="absolute h-2 rounded-full bg-primary" style={{ width: "40%" }}></div>
                  </div>
                  <p className="text-xs text-neutral-medium">40% complete</p>
                </div>
                <div className="p-3 border border-neutral-light rounded-lg">
                  <h4 className="font-medium">Export Documentation Mastery</h4>
                  <p className="text-sm text-neutral-medium mb-2">8 courses • 3.5 hours total</p>
                  <div className="relative h-2 w-full bg-neutral-light rounded-full mb-1">
                    <div className="absolute h-2 rounded-full bg-primary" style={{ width: "15%" }}></div>
                  </div>
                  <p className="text-xs text-neutral-medium">15% complete</p>
                </div>
                <div className="p-3 border border-neutral-light rounded-lg">
                  <h4 className="font-medium">Financial Management</h4>
                  <p className="text-sm text-neutral-medium mb-2">6 courses • 4 hours total</p>
                  <div className="relative h-2 w-full bg-neutral-light rounded-full mb-1">
                    <div className="absolute h-2 rounded-full bg-primary" style={{ width: "0%" }}></div>
                  </div>
                  <p className="text-xs text-neutral-medium">Not started</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View All Learning Paths
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
};

export default LearningHubPage;
