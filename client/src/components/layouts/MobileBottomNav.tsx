import { Link } from "wouter";

interface MobileBottomNavProps {
  currentPath: string;
}

const MobileBottomNav = ({ currentPath }: MobileBottomNavProps) => {
  const navItems = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: "ri-dashboard-line",
      isActive: currentPath === "/" || currentPath === "/dashboard"
    },
    {
      href: "/marketplace",
      label: "Market",
      icon: "ri-store-2-line",
      isActive: currentPath === "/marketplace"
    },
    {
      href: "/storefront",
      label: "Store",
      icon: "ri-store-line",
      isActive: currentPath === "/storefront"
    },
    {
      href: "/community",
      label: "Community",
      icon: "ri-team-line",
      isActive: currentPath === "/community"
    },
    {
      href: "/settings",
      label: "Menu",
      icon: "ri-menu-line",
      isActive: currentPath === "/settings"
    }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-light z-10">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <a className={`flex flex-col items-center p-2 ${
              item.isActive ? "text-primary" : "text-neutral-medium"
            }`}>
              <i className={`${item.icon} text-xl`}></i>
              <span className="text-xs mt-1">{item.label}</span>
            </a>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
