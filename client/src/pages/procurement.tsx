import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BadgeIcon } from "@/components/ui/badge-icon";
import LoadingState from "@/components/shared/LoadingState";
import EmptyState from "@/components/shared/EmptyState";
import { Procurement } from "@/types";
import { Helmet } from "react-helmet";

const ProcurementCard = ({ procurement }: { procurement: Procurement }) => {
  // Format the due date
  const dueDate = new Date(procurement.dueDate);
  const formattedDueDate = dueDate.toLocaleDateString('en-IN', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  });
  
  // Calculate days remaining
  const today = new Date();
  const daysRemaining = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <BadgeIcon
            icon="ri-file-list-3-line"
            color="secondary"
            className="mt-1"
          />
          <div>
            <h3 className="font-medium text-lg mb-1">{procurement.title}</h3>
            <div className="flex items-center mb-2">
              <span className="bg-neutral-lightest text-neutral-medium text-xs px-2 py-0.5 rounded">
                {procurement.category}
              </span>
              <span className="ml-2 bg-secondary bg-opacity-10 text-secondary text-xs px-2 py-0.5 rounded">
                {procurement.organization}
              </span>
            </div>
            <p className="text-sm text-neutral-medium mb-3">
              {procurement.description}
            </p>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center text-sm">
                <i className="ri-time-line mr-1 text-neutral-medium"></i>
                <span className={`${daysRemaining < 5 ? 'text-error' : 'text-neutral-dark'}`}>
                  Due: {formattedDueDate} ({daysRemaining} days left)
                </span>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button size="sm" className="bg-secondary hover:bg-secondary-dark text-white">
                Apply Now
              </Button>
              <Button size="sm" variant="outline">
                Save for Later
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ProcurementPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<string>("all");
  
  const { data: procurements, isLoading } = useQuery({
    queryKey: ['/api/procurements'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/procurements', undefined);
      return res.json() as Promise<Procurement[]>;
    }
  });

  const { data: recommendedProcurements, isLoading: isLoadingRecommended } = useQuery({
    queryKey: ['/api/procurements/recommended'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/procurements/recommended', undefined);
      return res.json() as Promise<Procurement[]>;
    }
  });

  // Filter procurements based on search query, category, and active tab
  const filteredProcurements = procurements?.filter(procurement => {
    const matchesSearch = 
      procurement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      procurement.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      procurement.organization.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || procurement.category === categoryFilter;
    
    // If on recommended tab, only show recommended procurements
    if (activeTab === "recommended") {
      return matchesSearch && 
             matchesCategory && 
             recommendedProcurements?.some(rec => rec.id === procurement.id);
    }
    
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Helmet>
        <title>Procurement | SheTrade Connect</title>
        <link href="https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.css" rel="stylesheet" />
      </Helmet>

      <div className="mb-8">
        <h1 className="font-display font-bold text-2xl md:text-3xl text-neutral-dark mb-2">
          Procurement Access Hub
        </h1>
        <p className="text-neutral-medium">
          Discover and apply for procurement opportunities from government and corporate buyers
        </p>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <i className="ri-search-line text-neutral-medium"></i>
            </div>
            <Input
              type="search"
              className="pl-10 pr-4 py-2 w-full"
              placeholder="Search by title, organization, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="w-full md:w-48">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Government">Government</SelectItem>
              <SelectItem value="Corporate">Corporate</SelectItem>
              <SelectItem value="International">International</SelectItem>
              <SelectItem value="NGO">NGO</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Opportunities</TabsTrigger>
          <TabsTrigger value="recommended">Recommended for You</TabsTrigger>
          <TabsTrigger value="closing">Closing Soon</TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading || (activeTab === "recommended" && isLoadingRecommended) ? (
        <LoadingState type="card" count={6} />
      ) : filteredProcurements && filteredProcurements.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProcurements.map((procurement) => (
            <ProcurementCard key={procurement.id} procurement={procurement} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No procurement opportunities found"
          description="Try adjusting your search criteria or check back later for new opportunities."
          icon="ri-file-list-3-line"
        />
      )}
    </>
  );
};

export default ProcurementPage;
