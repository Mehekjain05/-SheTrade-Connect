import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import TopNav from "./TopNav";
import MobileBottomNav from "./MobileBottomNav";
import AIAssistant from "../shared/AIAssistant";
import { useLocation } from "wouter";

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const [location] = useLocation();

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar - Desktop only */}
      <Sidebar currentPath={location} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation Bar */}
        <TopNav />

        {/* Main Content Area with Overflow */}
        <div className="flex-1 overflow-y-auto bg-neutral-lightest p-6">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation - Only visible on small screens */}
      <MobileBottomNav currentPath={location} />

      {/* AI Assistant Widget - Fixed Position */}
      <AIAssistant />
    </div>
  );
};

export default AppLayout;
