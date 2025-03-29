import { CardContent, Card } from "@/components/ui/card";
import { BadgeIcon } from "@/components/ui/badge-icon";
import { Metrics } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

interface PerformanceMetricsProps {
  metrics?: Metrics;
  isLoading?: boolean;
}

const MetricCard = ({ 
  title, 
  value, 
  change, 
  icon, 
  iconColor, 
  isLoading 
}: { 
  title: string; 
  value: string | number; 
  change: string; 
  icon: string; 
  iconColor: string; 
  isLoading?: boolean;
}) => {
  if (isLoading) {
    return (
      <Card className="bg-white rounded-lg shadow-sm p-4 border border-neutral-light">
        <CardContent className="p-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-medium text-sm">{title}</p>
              <Skeleton className="h-8 w-20 mt-1" />
              <Skeleton className="h-4 w-28 mt-1" />
            </div>
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white rounded-lg shadow-sm p-4 border border-neutral-light">
      <CardContent className="p-0">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-neutral-medium text-sm">{title}</p>
            <h3 className="font-display font-semibold text-2xl">{value}</h3>
            <p className="text-success text-xs flex items-center">
              <i className="ri-arrow-up-line mr-1"></i>
              <span>{change}</span>
            </p>
          </div>
          <BadgeIcon
            icon={icon}
            color={iconColor}
          />
        </div>
      </CardContent>
    </Card>
  );
};

const PerformanceMetrics = ({ metrics, isLoading = false }: PerformanceMetricsProps) => {
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount / 100);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <MetricCard
        title="Store Visits"
        value={metrics?.storeVisits || 0}
        change="12% from last month"
        icon="ri-eye-line"
        iconColor="primary"
        isLoading={isLoading}
      />
      
      <MetricCard
        title="Orders"
        value={metrics?.orders || 0}
        change="8% from last month"
        icon="ri-shopping-bag-line"
        iconColor="accent"
        isLoading={isLoading}
      />
      
      <MetricCard
        title="New Connections"
        value={metrics?.connections || 0}
        change="5 new this week"
        icon="ri-link-m"
        iconColor="secondary"
        isLoading={isLoading}
      />
      
      <MetricCard
        title="Revenue"
        value={metrics ? formatCurrency(metrics.revenue) : "₹0"}
        change="15% increase"
        icon="ri-money-rupee-circle-line"
        iconColor="primary"
        isLoading={isLoading}
      />
    </div>
  );
};

export default PerformanceMetrics;
