import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import WelcomeHeader from "@/components/dashboard/WelcomeHeader";
import PerformanceMetrics from "@/components/dashboard/PerformanceMetrics";
import AIRecommendations from "@/components/dashboard/AIRecommendations";
import StorefrontPreview from "@/components/dashboard/StorefrontPreview";
import CommunityAndLearning from "@/components/dashboard/CommunityAndLearning";
import FinancialTools from "@/components/dashboard/FinancialTools";
import { Metrics, User } from "@/types";
import { Helmet } from "react-helmet";

// Mock user ID for demonstration
const CURRENT_USER_ID = 1;

const Dashboard = () => {
  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: [`/api/users/${CURRENT_USER_ID}`],
    queryFn: async () => {
      const res = await apiRequest('GET', `/api/users/${CURRENT_USER_ID}`, undefined);
      return res.json() as Promise<User>;
    }
  });

  const { data: metrics, isLoading: isLoadingMetrics } = useQuery({
    queryKey: [`/api/metrics/${CURRENT_USER_ID}`],
    queryFn: async () => {
      const res = await apiRequest('GET', `/api/metrics/${CURRENT_USER_ID}`, undefined);
      return res.json() as Promise<Metrics>;
    }
  });

  return (
    <>
      <Helmet>
        <title>Dashboard | SheTrade Connect</title>
        <link href="https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.css" rel="stylesheet" />
      </Helmet>

      {/* Welcome Section */}
      <WelcomeHeader userName={user?.name || "Entrepreneur"} />
      
      {/* Business Performance Summary */}
      <PerformanceMetrics metrics={metrics} isLoading={isLoadingMetrics} />
      
      {/* AI Recommendations Section */}
      <AIRecommendations />
      
      {/* Digital Storefront Preview Section */}
      <StorefrontPreview userId={CURRENT_USER_ID} />
      
      {/* Community & Learning Hub Section */}
      <CommunityAndLearning />
      
      {/* Financial Tools Preview */}
      <FinancialTools />
    </>
  );
};

export default Dashboard;
