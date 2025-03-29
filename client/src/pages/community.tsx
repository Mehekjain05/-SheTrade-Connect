import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import LoadingState from "@/components/shared/LoadingState";
import EmptyState from "@/components/shared/EmptyState";
import { ForumPost, User } from "@/types";
import { Helmet } from "react-helmet";

// New post form schema
const postFormSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }).max(100),
  content: z.string().min(10, { message: "Content must be at least 10 characters" }),
  tags: z.string().optional()
});

type PostFormValues = z.infer<typeof postFormSchema>;

const ForumPostCard = ({ post, currentUser }: { post: ForumPost; currentUser: User }) => {
  // Format date
  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
  
  // Get first letter of user's name for the avatar
  const userInitials = post.userId === currentUser.id 
    ? currentUser.name.slice(0, 2).toUpperCase()
    : `U${post.userId}`;
  
  // Determine the background color based on user ID for some visual variety
  const bgColorClasses = [
    "bg-primary-light",
    "bg-accent-light",
    "bg-secondary-light"
  ];
  const bgColorClass = bgColorClasses[post.userId % bgColorClasses.length];
  
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex space-x-3">
          <div className={`w-10 h-10 rounded-full ${bgColorClass} flex items-center justify-center text-white overflow-hidden`}>
            <span>{userInitials}</span>
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-lg">{post.title}</h3>
            <p className="text-sm text-neutral-medium">
              {post.userId === currentUser.id ? "You" : `User ${post.userId}`} • {formattedDate} • {post.responseCount} responses
            </p>
            
            <div className="mt-3 text-sm text-neutral-dark">
              <p>{post.content}</p>
            </div>
            
            <div className="mt-3 flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <span key={index} className="px-2 py-0.5 bg-neutral-lightest text-neutral-medium text-xs rounded">
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="mt-4 flex space-x-2">
              <Button size="sm" variant="outline">
                <i className="ri-message-3-line mr-1"></i>
                Reply
              </Button>
              <Button size="sm" variant="ghost">
                <i className="ri-heart-line mr-1"></i>
                Like
              </Button>
              <Button size="sm" variant="ghost">
                <i className="ri-share-line mr-1"></i>
                Share
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const NewPostDialog = ({ onPostCreated }: { onPostCreated: () => void }) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const currentUser = { id: 1 }; // Mock current user, in real app this would come from auth context
  
  const form = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      title: "",
      content: "",
      tags: ""
    }
  });
  
  const createPostMutation = useMutation({
    mutationFn: async (data: { title: string; content: string; tags: string[] }) => {
      const postData = {
        userId: currentUser.id,
        title: data.title,
        content: data.content,
        tags: data.tags
      };
      
      await apiRequest('POST', '/api/forum-posts', postData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/forum-posts'] });
      form.reset();
      setOpen(false);
      onPostCreated();
    }
  });
  
  const onSubmit = (data: PostFormValues) => {
    // Convert tags string to array
    const tags = data.tags ? data.tags.split(',').map(tag => tag.trim()) : [];
    
    createPostMutation.mutate({
      title: data.title,
      content: data.content,
      tags
    });
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary-dark text-white">
          <i className="ri-add-line mr-2"></i>
          <span>Start a Discussion</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Start a New Discussion</DialogTitle>
          <DialogDescription>
            Share your thoughts, ask questions, or seek advice from the community
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter a descriptive title"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Share your thoughts or questions..."
                      className="min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags (comma separated)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Marketing, Digital, Export"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-primary text-white"
                disabled={createPostMutation.isPending}
              >
                {createPostMutation.isPending ? "Posting..." : "Post Discussion"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

const CommunityPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUser, setCurrentUser] = useState<User>({
    id: 1,
    username: "sophia_patel",
    name: "Sophia Patel",
    businessName: "Eco Textiles Ltd",
    email: "sophia@ecotextiles.com",
    createdAt: new Date()
  });
  
  const { data: forumPosts, isLoading } = useQuery({
    queryKey: ['/api/forum-posts'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/forum-posts', undefined);
      return res.json() as Promise<ForumPost[]>;
    }
  });

  // Filter posts based on search query
  const filteredPosts = forumPosts?.filter(post => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesSearch;
  });
  
  // Group posts by category for the different tabs
  const myPosts = filteredPosts?.filter(post => post.userId === currentUser.id);
  const popularPosts = filteredPosts?.sort((a, b) => b.responseCount - a.responseCount);
  const recentPosts = filteredPosts?.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <>
      <Helmet>
        <title>Community Forum | SheTrade Connect</title>
        <link href="https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.css" rel="stylesheet" />
      </Helmet>

      <div className="mb-8">
        <h1 className="font-display font-bold text-2xl md:text-3xl text-neutral-dark mb-2">
          Community Forum
        </h1>
        <p className="text-neutral-medium">
          Connect, share, and learn from other women entrepreneurs
        </p>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between items-start">
        <div className="flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <i className="ri-search-line text-neutral-medium"></i>
            </div>
            <Input
              type="search"
              className="pl-10 pr-4 py-2 w-full"
              placeholder="Search discussions by title, content, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div>
          <NewPostDialog onPostCreated={() => console.log("Post created successfully")} />
        </div>
      </div>

      <Tabs defaultValue="recent" className="mb-6">
        <TabsList>
          <TabsTrigger value="recent">Recent Discussions</TabsTrigger>
          <TabsTrigger value="popular">Popular</TabsTrigger>
          <TabsTrigger value="my-posts">My Posts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="recent">
          {isLoading ? (
            <LoadingState type="card" count={4} />
          ) : recentPosts && recentPosts.length > 0 ? (
            <div className="space-y-4">
              {recentPosts.map((post) => (
                <ForumPostCard key={post.id} post={post} currentUser={currentUser} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No discussions found"
              description="Start the first discussion and help build our community!"
              actionLabel="Start a Discussion"
              onAction={() => console.log("Start discussion clicked")}
              icon="ri-discuss-line"
            />
          )}
        </TabsContent>
        
        <TabsContent value="popular">
          {isLoading ? (
            <LoadingState type="card" count={4} />
          ) : popularPosts && popularPosts.length > 0 ? (
            <div className="space-y-4">
              {popularPosts.map((post) => (
                <ForumPostCard key={post.id} post={post} currentUser={currentUser} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No popular discussions yet"
              description="Start engaging with the community to see popular discussions here."
              actionLabel="Start a Discussion"
              onAction={() => console.log("Start discussion clicked")}
              icon="ri-discuss-line"
            />
          )}
        </TabsContent>
        
        <TabsContent value="my-posts">
          {isLoading ? (
            <LoadingState type="card" count={4} />
          ) : myPosts && myPosts.length > 0 ? (
            <div className="space-y-4">
              {myPosts.map((post) => (
                <ForumPostCard key={post.id} post={post} currentUser={currentUser} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="You haven't started any discussions"
              description="Share your thoughts, ask questions, or seek advice from the community."
              actionLabel="Start a Discussion"
              onAction={() => console.log("Start discussion clicked")}
              icon="ri-discuss-line"
            />
          )}
        </TabsContent>
      </Tabs>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Community Guidelines</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Be Respectful</h3>
              <p className="text-sm text-neutral-medium">Treat others with respect. Disagreements are natural, but please express yourself in a constructive manner.</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Share Your Knowledge</h3>
              <p className="text-sm text-neutral-medium">Be generous with your expertise. Helping others succeed strengthens our entire community.</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Keep It Relevant</h3>
              <p className="text-sm text-neutral-medium">Stay on topic and keep discussions related to business, entrepreneurship, and relevant challenges.</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">No Self-Promotion</h3>
              <p className="text-sm text-neutral-medium">Avoid excessive self-promotion. Focus on providing value rather than advertising.</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Active Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center text-white overflow-hidden mr-3">
                  <span>SP</span>
                </div>
                <div>
                  <p className="font-medium">Sophia Patel</p>
                  <p className="text-sm text-neutral-medium">Eco Textiles Ltd</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-accent-light flex items-center justify-center text-white overflow-hidden mr-3">
                  <span>PR</span>
                </div>
                <div>
                  <p className="font-medium">Priya Rao</p>
                  <p className="text-sm text-neutral-medium">Global Exports</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-secondary-light flex items-center justify-center text-white overflow-hidden mr-3">
                  <span>AM</span>
                </div>
                <div>
                  <p className="font-medium">Anita Mehta</p>
                  <p className="text-sm text-neutral-medium">Anita's Organics</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center text-white overflow-hidden mr-3">
                  <span>SS</span>
                </div>
                <div>
                  <p className="font-medium">Sarah Singh</p>
                  <p className="text-sm text-neutral-medium">Digital Marketing Pro</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">View All Members</Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default CommunityPage;
