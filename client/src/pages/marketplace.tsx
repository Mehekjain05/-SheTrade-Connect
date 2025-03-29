import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BadgeIcon } from "@/components/ui/badge-icon";
import LoadingState from "@/components/shared/LoadingState";
import EmptyState from "@/components/shared/EmptyState";
import { Supplier } from "@/types";
import { Helmet } from "react-helmet";

const Marketplace = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  
  const { data: suppliers, isLoading } = useQuery({
    queryKey: ['/api/suppliers'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/suppliers', undefined);
      return res.json() as Promise<Supplier[]>;
    }
  });

  // Filter suppliers based on search query and category
  const filteredSuppliers = suppliers?.filter(supplier => {
    const matchesSearch = 
      supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || supplier.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Helmet>
        <title>Marketplace | SheTrade Connect</title>
        <link href="https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.css" rel="stylesheet" />
      </Helmet>

      <div className="mb-8">
        <h1 className="font-display font-bold text-2xl md:text-3xl text-neutral-dark mb-2">
          Marketplace
        </h1>
        <p className="text-neutral-medium">
          Connect with verified suppliers, buyers, and trade opportunities
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
              placeholder="Search suppliers, materials, services..."
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
              <SelectItem value="Raw Materials">Raw Materials</SelectItem>
              <SelectItem value="Packaging">Packaging</SelectItem>
              <SelectItem value="Logistics">Logistics</SelectItem>
              <SelectItem value="Manufacturing">Manufacturing</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <LoadingState type="card" count={6} />
      ) : filteredSuppliers && filteredSuppliers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSuppliers.map((supplier) => (
            <Card key={supplier.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <BadgeIcon
                    icon="ri-store-2-line"
                    color="primary"
                    className="mt-1"
                  />
                  <div>
                    <h3 className="font-medium text-lg mb-1">{supplier.name}</h3>
                    <div className="flex items-center mb-2">
                      <span className="bg-neutral-lightest text-neutral-medium text-xs px-2 py-0.5 rounded">
                        {supplier.category}
                      </span>
                      {supplier.costSavings && (
                        <span className="ml-2 bg-success bg-opacity-10 text-success text-xs px-2 py-0.5 rounded flex items-center">
                          <i className="ri-arrow-down-line mr-0.5 text-xs"></i>
                          {supplier.costSavings}% savings
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-neutral-medium mb-4">
                      {supplier.description || "Supplier of high-quality materials and services."}
                    </p>
                    <Button size="sm" className="bg-primary hover:bg-primary-dark text-white">
                      Connect
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No suppliers found"
          description="Try adjusting your search criteria or check back later for new suppliers."
          icon="ri-store-2-line"
        />
      )}
    </>
  );
};

export default Marketplace;
