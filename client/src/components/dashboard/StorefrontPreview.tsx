import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useLocation } from "wouter";
import { Storefront, Product } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

const StorefrontPreview = ({ userId = 1 }) => {
  const [, setLocation] = useLocation();
  
  const { data: storefront, isLoading: isLoadingStorefront } = useQuery({
    queryKey: [`/api/storefronts/${userId}`],
    queryFn: async () => {
      const res = await apiRequest('GET', `/api/storefronts/${userId}`, undefined);
      return res.json() as Promise<Storefront>;
    }
  });

  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: [`/api/products?userId=${userId}`],
    queryFn: async () => {
      const res = await apiRequest('GET', `/api/products?userId=${userId}`, undefined);
      return res.json() as Promise<Product[]>;
    }
  });

  const handleContinueSetup = () => {
    setLocation("/storefront");
  };

  const handleEditStore = () => {
    setLocation("/storefront");
  };

  if (isLoadingStorefront || isLoadingProducts) {
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-lg">Your Digital Storefront</h2>
          <Button variant="link" className="text-primary hover:text-primary-dark text-sm font-medium p-0">
            Edit Store
          </Button>
        </div>

        <Card className="bg-white rounded-lg shadow-sm overflow-hidden border border-neutral-light">
          <div className="flex flex-col md:flex-row animate-pulse">
            <div className="md:w-1/3 p-6 flex flex-col">
              <Skeleton className="h-6 w-40 mb-4" />
              <Skeleton className="h-3 w-full mb-3" />
              <Skeleton className="h-4 w-48 mb-8" />
              
              <Skeleton className="h-5 w-40 mb-4" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
              
              <Skeleton className="h-9 w-full mt-6" />
            </div>
            
            <div className="md:w-2/3 bg-neutral-lightest border-t md:border-t-0 md:border-l border-neutral-light">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <Skeleton className="w-12 h-12 rounded-lg mr-3" />
                  <div>
                    <Skeleton className="h-5 w-40 mb-1" />
                    <Skeleton className="h-4 w-60" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white rounded-lg overflow-hidden border border-neutral-light shadow-sm">
                      <Skeleton className="h-32 w-full" />
                      <div className="p-3">
                        <Skeleton className="h-4 w-3/4 mb-1" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display font-semibold text-lg">Your Digital Storefront</h2>
        <Button 
          variant="link" 
          className="text-primary hover:text-primary-dark text-sm font-medium p-0"
          onClick={handleEditStore}
        >
          Edit Store
        </Button>
      </div>

      <Card className="bg-white rounded-lg shadow-sm overflow-hidden border border-neutral-light">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 p-6 flex flex-col">
            <h3 className="font-medium mb-2">Store Completion</h3>
            <Progress 
              value={storefront?.completionPercentage || 0} 
              className="h-3 mb-3" 
            />
            <p className="text-sm text-neutral-medium mb-4">
              {storefront?.completionPercentage || 0}% complete - {5 - Object.values(storefront?.setupSteps || {}).filter(Boolean).length} steps remaining
            </p>
            
            <h4 className="text-sm font-medium mb-2">Complete these steps:</h4>
            <ul className="text-sm space-y-2 text-neutral-medium">
              <li className="flex items-center">
                <i className={`${storefront?.setupSteps?.basicInfo ? 'ri-checkbox-circle-line text-success' : 'ri-checkbox-blank-circle-line text-neutral-medium'} mr-2`}></i>
                <span>Basic store information</span>
              </li>
              <li className="flex items-center">
                <i className={`${storefront?.setupSteps?.products ? 'ri-checkbox-circle-line text-success' : 'ri-checkbox-blank-circle-line text-neutral-medium'} mr-2`}></i>
                <span>Add products ({products?.length || 0}/5)</span>
              </li>
              <li className="flex items-center">
                <i className={`${storefront?.setupSteps?.logo ? 'ri-checkbox-circle-line text-success' : 'ri-checkbox-blank-circle-line text-neutral-medium'} mr-2`}></i>
                <span>Upload company logo</span>
              </li>
              <li className="flex items-center">
                <i className={`${storefront?.setupSteps?.payment ? 'ri-checkbox-circle-line text-success' : 'ri-checkbox-blank-circle-line text-neutral-medium'} mr-2`}></i>
                <span>Connect payment methods</span>
              </li>
              <li className="flex items-center">
                <i className={`${storefront?.setupSteps?.shipping ? 'ri-checkbox-circle-line text-success' : 'ri-checkbox-blank-circle-line text-neutral-medium'} mr-2`}></i>
                <span>Set up shipping options</span>
              </li>
            </ul>
            
            <Button 
              className="mt-auto bg-primary hover:bg-primary-dark text-white font-medium rounded-lg px-4 py-2 flex items-center justify-center mt-4"
              onClick={handleContinueSetup}
            >
              <span>Continue Setup</span>
            </Button>
          </div>
          
          <div className="md:w-2/3 bg-neutral-lightest border-t md:border-t-0 md:border-l border-neutral-light">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-lg bg-primary-light mr-3 flex items-center justify-center text-white overflow-hidden">
                  <span className="text-lg font-medium">ET</span>
                </div>
                <div>
                  <h3 className="font-medium">Eco Textiles Ltd</h3>
                  <p className="text-sm text-neutral-medium">Sustainable fabrics from recycled materials</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {products?.map((product) => (
                  <div key={product.id} className="bg-white rounded-lg overflow-hidden border border-neutral-light shadow-sm">
                    <div className="h-32 bg-neutral-light flex items-center justify-center overflow-hidden">
                      <img 
                        src={product.image || "https://placehold.co/400x240?text=No+Image"} 
                        alt={product.name} 
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="p-3">
                      <h4 className="font-medium text-sm">{product.name}</h4>
                      <p className="text-primary font-medium text-sm mt-1">
                        {new Intl.NumberFormat('en-IN', {
                          style: 'currency',
                          currency: 'INR',
                          maximumFractionDigits: 0,
                        }).format(product.price / 100)}
                        /meter
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StorefrontPreview;
