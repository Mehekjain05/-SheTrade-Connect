import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useLocation } from "wouter";
import { FinancialOffer } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

const FinancialTools = () => {
  const [, setLocation] = useLocation();
  
  const { data: financialOffers, isLoading } = useQuery({
    queryKey: ['/api/financial-offers'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/financial-offers', undefined);
      return res.json() as Promise<FinancialOffer[]>;
    }
  });

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount / 100);
  };

  if (isLoading) {
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-lg">Financial Tools</h2>
          <Button variant="link" className="text-primary hover:text-primary-dark text-sm font-medium p-0">
            View All
          </Button>
        </div>
        
        <Card className="bg-white rounded-lg shadow-sm border border-neutral-light p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <Skeleton className="h-5 w-40 mb-3" />
              <div className="flex items-center mb-3">
                <Skeleton className="flex-1 h-3 rounded-full" />
                <Skeleton className="ml-3 h-5 w-16" />
              </div>
              <Skeleton className="h-4 w-48 mb-3" />
              <Skeleton className="h-4 w-32" />
            </div>
            
            <div className="space-y-3">
              <Skeleton className="h-5 w-40 mb-3" />
              <div className="space-y-2 mb-3">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
              <Skeleton className="h-4 w-32" />
            </div>
            
            <div className="space-y-3">
              <Skeleton className="h-5 w-40 mb-3" />
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <Skeleton className="h-4 w-32 mb-1" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Skeleton className="h-4 w-32 mb-1" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
              <Skeleton className="h-4 w-32 mt-3" />
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display font-semibold text-lg">Financial Tools</h2>
        <Button 
          variant="link" 
          className="text-primary hover:text-primary-dark text-sm font-medium p-0"
          onClick={() => setLocation("/finance")}
        >
          View All
        </Button>
      </div>
      
      <Card className="bg-white rounded-lg shadow-sm border border-neutral-light p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-medium mb-3">Credit Score Analysis</h3>
            <div className="flex items-center mb-3">
              <div className="flex-1 h-3 bg-neutral-light rounded-full overflow-hidden">
                <Progress value={78} className="h-3" />
              </div>
              <span className="ml-3 font-medium">78/100</span>
            </div>
            <p className="text-sm text-neutral-medium mb-3">Your business credit score is in good standing</p>
            <a href="#" className="text-primary hover:text-primary-dark text-sm font-medium">View Detailed Report</a>
          </div>
          
          <div>
            <h3 className="font-medium mb-3">Available Financing</h3>
            <div className="space-y-2 mb-3">
              {financialOffers?.map((offer) => (
                <div key={offer.id} className="flex justify-between items-center">
                  <span className="text-sm">{offer.type.replace('_', ' ').charAt(0).toUpperCase() + offer.type.replace('_', ' ').slice(1)}</span>
                  <span className="text-sm font-medium">{formatCurrency(offer.amount)}</span>
                </div>
              ))}
            </div>
            <Button 
              variant="link" 
              className="text-primary hover:text-primary-dark text-sm font-medium p-0"
              onClick={() => setLocation("/finance")}
            >
              Apply for Financing
            </Button>
          </div>
          
          <div>
            <h3 className="font-medium mb-3">Outstanding Payments</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Fashion Retail Inc.</p>
                  <p className="text-xs text-neutral-medium">Due in 5 days</p>
                </div>
                <span className="text-sm font-medium">₹45,000</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">EcoHome Products</p>
                  <p className="text-xs text-neutral-medium">Due in 12 days</p>
                </div>
                <span className="text-sm font-medium">₹32,000</span>
              </div>
            </div>
            <div className="mt-3">
              <Button 
                variant="link" 
                className="text-primary hover:text-primary-dark text-sm font-medium p-0"
                onClick={() => setLocation("/finance")}
              >
                Manage Invoices
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FinancialTools;
