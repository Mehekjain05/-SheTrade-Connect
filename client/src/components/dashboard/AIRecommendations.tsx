import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BadgeIcon } from "@/components/ui/badge-icon";
import { Skeleton } from "@/components/ui/skeleton";
import { Recommendation } from "@/types";

const RecommendationCard = ({ 
  title, 
  description, 
  icon, 
  color, 
  linkText, 
  linkHref,
  isLoading
}: { 
  title: string; 
  description: string; 
  icon: string; 
  color: string; 
  linkText: string; 
  linkHref: string;
  isLoading?: boolean;
}) => {
  if (isLoading) {
    return (
      <Card className="bg-white rounded-lg shadow-sm overflow-hidden border border-neutral-light hover:shadow-md transition-shadow">
        <div className="h-2 bg-primary"></div>
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Skeleton className="flex-shrink-0 w-10 h-10 rounded-full" />
            <div className="w-full">
              <Skeleton className="h-5 w-1/3 mb-2" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-2/3 mb-3" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white rounded-lg shadow-sm overflow-hidden border border-neutral-light hover:shadow-md transition-shadow">
      <div className={`h-2 bg-${color}`}></div>
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <BadgeIcon icon={icon} color={color} />
          <div>
            <h3 className="font-medium">{title}</h3>
            <p className="text-sm text-neutral-medium mt-1">{description}</p>
            <div className="mt-3">
              <a 
                href={linkHref} 
                className={`text-${color} hover:text-${color}-dark text-sm font-medium`}
              >
                {linkText}
              </a>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const AIRecommendations = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['/api/recommendations'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/recommendations', undefined);
      return res.json() as Promise<Recommendation>;
    }
  });

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display font-semibold text-lg">AI-Powered Recommendations</h2>
        <Button variant="link" className="text-primary hover:text-primary-dark text-sm font-medium p-0">
          View All
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {isLoading ? (
          <>
            <RecommendationCard 
              title="" 
              description="" 
              icon="" 
              color="primary" 
              linkText="" 
              linkHref="#"
              isLoading={true}
            />
            <RecommendationCard 
              title="" 
              description="" 
              icon="" 
              color="secondary" 
              linkText="" 
              linkHref="#"
              isLoading={true}
            />
            <RecommendationCard 
              title="" 
              description="" 
              icon="" 
              color="accent" 
              linkText="" 
              linkHref="#"
              isLoading={true}
            />
          </>
        ) : (
          <>
            {data?.suppliers && data.suppliers.length > 0 && (
              <RecommendationCard 
                title="Supplier Match" 
                description={`${data.suppliers.length} new suppliers match your material needs with ${data.suppliers[0].costSavings || 20}% lower costs.`}
                icon="ri-store-2-line" 
                color="primary" 
                linkText="View Matches" 
                linkHref="/marketplace"
              />
            )}
            
            {data?.procurements && data.procurements.length > 0 && (
              <RecommendationCard 
                title="Tender Alert" 
                description={`New ${data.procurements[0].organization} procurement opportunity for ${data.procurements[0].category.toLowerCase()} suppliers. Due in ${Math.ceil((new Date(data.procurements[0].dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days.`}
                icon="ri-file-list-3-line" 
                color="secondary" 
                linkText="View Opportunity" 
                linkHref="/procurement"
              />
            )}
            
            {data?.financialOffers && data.financialOffers.length > 0 && (
              <RecommendationCard 
                title="Financing Option" 
                description={`Based on your growth, you qualify for ${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(data.financialOffers[0].amount / 100)} in ${data.financialOffers[0].type.replace('_', ' ')} at ${data.financialOffers[0].interestRate / 100}% interest.`}
                icon="ri-bank-line" 
                color="accent" 
                linkText="Apply Now" 
                linkHref="/finance"
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AIRecommendations;
