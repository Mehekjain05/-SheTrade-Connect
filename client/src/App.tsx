import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Marketplace from "@/pages/marketplace";
import Storefront from "@/pages/storefront";
import Procurement from "@/pages/procurement";
import Finance from "@/pages/finance";
import Community from "@/pages/community";
import LearningHub from "@/pages/learning-hub";
import Settings from "@/pages/settings";
import AppLayout from "@/components/layouts/AppLayout";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/marketplace" component={Marketplace} />
      <Route path="/storefront" component={Storefront} />
      <Route path="/procurement" component={Procurement} />
      <Route path="/finance" component={Finance} />
      <Route path="/community" component={Community} />
      <Route path="/learning-hub" component={LearningHub} />
      <Route path="/settings" component={Settings} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppLayout>
        <Router />
      </AppLayout>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
