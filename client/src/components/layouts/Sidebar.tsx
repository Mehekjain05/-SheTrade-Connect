import { Link } from "wouter";
import { NavItem } from "@/types";

interface SidebarProps {
  currentPath: string;
}

const Sidebar = ({ currentPath }: SidebarProps) => {
  const navItems: NavItem[] = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: "ri-dashboard-line",
      isActive: currentPath === "/" || currentPath === "/dashboard"
    },
    {
      href: "/marketplace",
      label: "Marketplace",
      icon: "ri-store-2-line",
      isActive: currentPath === "/marketplace"
    },
    {
      href: "/storefront",
      label: "My Storefront",
      icon: "ri-store-line",
      isActive: currentPath === "/storefront"
    },
    {
      href: "/procurement",
      label: "Procurement",
      icon: "ri-file-list-3-line",
      isActive: currentPath === "/procurement"
    },
    {
      href: "/finance",
      label: "Financial Tools",
      icon: "ri-bank-line",
      isActive: currentPath === "/finance"
    },
    {
      href: "/community",
      label: "Community",
      icon: "ri-team-line",
      isActive: currentPath === "/community"
    },
    {
      href: "/learning-hub",
      label: "Learning Hub",
      icon: "ri-book-open-line",
      isActive: currentPath === "/learning-hub"
    }
  ];

  return (
    <aside className="hidden md:flex md:flex-col w-64 bg-white border-r border-neutral-light">
      {/* Logo Container */}
      <div className="p-4 border-b border-neutral-light">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <i className="ri-exchange-line text-white text-xl"></i>
          </div>
          <h1 className="font-display font-bold text-xl text-primary">SheTrade</h1>
        </div>
      </div>

      {/* User Profile Card */}
      <div className="p-4 border-b border-neutral-light">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center text-white font-medium">
            SP
          </div>
          <div>
            <h3 className="font-medium text-neutral-dark">Sophia Patel</h3>
            <p className="text-sm text-neutral-medium">Eco Textiles Ltd</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>
                <a className={`flex items-center px-3 py-2 rounded-lg ${
                  item.isActive 
                    ? "bg-primary-light bg-opacity-10 text-primary font-medium" 
                    : "hover:bg-neutral-lightest text-neutral-dark font-medium"
                }`}>
                  <i className={`${item.icon} mr-3`}></i>
                  <span>{item.label}</span>
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Settings Link */}
      <div className="p-4 border-t border-neutral-light">
        <Link href="/settings">
          <a className="flex items-center text-neutral-medium hover:text-neutral-dark">
            <i className="ri-settings-3-line mr-3"></i>
            <span>Settings</span>
          </a>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
