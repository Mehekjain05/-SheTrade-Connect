import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

const TopNav = () => {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would search across the platform
    console.log("Searching for:", searchQuery);
  };

  const toggleMobileMenu = () => {
    // In a production app, this would toggle a mobile menu state
    console.log("Toggle mobile menu");
  };

  return (
    <header className="bg-white border-b border-neutral-light">
      <div className="flex items-center justify-between h-16 px-4">
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-neutral-dark p-2"
          onClick={toggleMobileMenu}
        >
          <i className="ri-menu-line text-xl"></i>
        </button>

        {/* Mobile Logo */}
        <div className="md:hidden flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <i className="ri-exchange-line text-white text-lg"></i>
          </div>
          <h1 className="font-display font-bold text-lg text-primary">SheTrade</h1>
        </div>

        {/* Search Bar */}
        <form 
          className="hidden md:flex flex-1 max-w-xl mx-4"
          onSubmit={handleSearch}
        >
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <i className="ri-search-line text-neutral-medium"></i>
            </div>
            <Input
              type="search"
              className="bg-neutral-lightest border border-neutral-light rounded-lg pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary-light text-sm"
              placeholder="Search suppliers, opportunities, resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>

        {/* Action Icons */}
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="p-1.5 relative text-neutral-medium hover:text-neutral-dark"
          >
            <i className="ri-notification-3-line text-xl"></i>
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-accent"></span>
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="p-1.5 text-neutral-medium hover:text-neutral-dark"
          >
            <i className="ri-message-3-line text-xl"></i>
          </Button>
          <div className="hidden md:flex md:w-8 md:h-8 rounded-full bg-primary-light items-center justify-center text-white font-medium">
            SP
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNav;
