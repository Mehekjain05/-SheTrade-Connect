import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";
import { ForumPost, LearningResource } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

const CommunityAndLearning = () => {
  const [, setLocation] = useLocation();
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);
  
  const { data: forumPosts, isLoading: isLoadingPosts } = useQuery({
    queryKey: ['/api/forum-posts'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/forum-posts', undefined);
      return res.json() as Promise<ForumPost[]>;
    }
  });

  const { data: learningResources, isLoading: isLoadingResources } = useQuery({
    queryKey: ['/api/learning-resources/recommended'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/learning-resources/recommended', undefined);
      return res.json() as Promise<LearningResource[]>;
    }
  });

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuestion.trim()) return;
    
    setIsLoadingResponse(true);
    try {
      const res = await apiRequest('POST', '/api/ai-assistant', { message: aiQuestion });
      const data = await res.json();
      setAiResponse(data.response);
    } catch (error) {
      console.error('Error asking AI:', error);
      setAiResponse("Sorry, I couldn't process your question at this time. Please try again later.");
    } finally {
      setIsLoadingResponse(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* Community Forum Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-lg">Community Forum</h2>
          <Button 
            variant="link" 
            className="text-primary hover:text-primary-dark text-sm font-medium p-0"
            onClick={() => setLocation("/community")}
          >
            View All
          </Button>
        </div>
        
        <Card className="bg-white rounded-lg shadow-sm overflow-hidden border border-neutral-light">
          {isLoadingPosts ? (
            <>
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 border-b border-neutral-light">
                  <div className="flex space-x-3">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="w-full">
                      <Skeleton className="h-5 w-2/3 mb-1" />
                      <Skeleton className="h-4 w-1/2 mb-2" />
                      <div className="mt-2 flex flex-wrap gap-2">
                        <Skeleton className="h-4 w-16 rounded" />
                        <Skeleton className="h-4 w-20 rounded" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <>
              {forumPosts?.slice(0, 3).map((post) => (
                <div key={post.id} className="p-4 border-b border-neutral-light">
                  <div className="flex space-x-3">
                    <div className="w-10 h-10 rounded-full bg-accent-light flex items-center justify-center text-white overflow-hidden">
                      <span>{post.title.slice(0, 2).toUpperCase()}</span>
                    </div>
                    <div>
                      <h4 className="font-medium">{post.title}</h4>
                      <p className="text-sm text-neutral-medium">
                        Started by User {post.userId} • {post.responseCount} responses
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {post.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-0.5 bg-neutral-lightest text-neutral-medium text-xs rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
          
          <CardFooter className="p-4 bg-neutral-lightest border-t border-neutral-light">
            <Button 
              variant="ghost"
              className="w-full py-2 flex items-center justify-center text-primary hover:text-primary-dark font-medium"
              onClick={() => setLocation("/community")}
            >
              <i className="ri-add-line mr-2"></i>
              <span>Start a Discussion</span>
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      {/* Learning Resources Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-lg">Learning Resources</h2>
          <Button 
            variant="link" 
            className="text-primary hover:text-primary-dark text-sm font-medium p-0"
            onClick={() => setLocation("/learning-hub")}
          >
            View All
          </Button>
        </div>
        
        <Card className="bg-white rounded-lg shadow-sm overflow-hidden border border-neutral-light">
          <div className="p-4 border-b border-neutral-light">
            <h3 className="font-medium mb-2">Recommended for You</h3>
            
            {isLoadingResources ? (
              <>
                <div className="flex space-x-3 items-center mb-4">
                  <Skeleton className="w-10 h-10 rounded" />
                  <div className="w-full">
                    <Skeleton className="h-4 w-3/4 mb-1" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
                <div className="flex space-x-3 items-center">
                  <Skeleton className="w-10 h-10 rounded" />
                  <div className="w-full">
                    <Skeleton className="h-4 w-3/4 mb-1" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              </>
            ) : (
              <>
                {learningResources?.slice(0, 2).map((resource) => (
                  <div key={resource.id} className="flex space-x-3 items-center mb-4 last:mb-0">
                    <div className={`w-10 h-10 rounded ${
                      resource.type === 'video' ? 'bg-primary bg-opacity-10 text-primary' :
                      resource.type === 'article' ? 'bg-accent bg-opacity-10 text-accent' :
                      'bg-secondary bg-opacity-10 text-secondary'
                    } flex items-center justify-center`}>
                      <i className={`${
                        resource.type === 'video' ? 'ri-video-line' :
                        resource.type === 'article' ? 'ri-file-text-line' :
                        'ri-book-open-line'
                      }`}></i>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">{resource.title}</h4>
                      <p className="text-xs text-neutral-medium">
                        {resource.duration} min {resource.type} • {resource.level}
                      </p>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
          
          <div className="p-4">
            <h3 className="font-medium mb-2">AI Business Assistant</h3>
            <p className="text-sm text-neutral-medium mb-3">Ask any business question and get personalized advice.</p>
            
            {aiResponse && (
              <div className="bg-neutral-lightest p-3 rounded-lg mb-3">
                <p className="text-sm italic text-neutral-medium">{aiResponse}</p>
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
                <i className="ri-send-plane-fill"></i>
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CommunityAndLearning;
