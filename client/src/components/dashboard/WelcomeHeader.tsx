import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

interface WelcomeHeaderProps {
  userName: string;
}

const WelcomeHeader = ({ userName }: WelcomeHeaderProps) => {
  const [, setLocation] = useLocation();
  
  const handleAddProducts = () => {
    setLocation("/storefront");
  };

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl md:text-3xl text-neutral-dark">
            Welcome back, {userName}
          </h1>
          <p className="text-neutral-medium mt-1">
            Continue growing your business with SheTrade Connect
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button 
            className="bg-primary hover:bg-primary-dark text-white font-medium rounded-lg px-4 py-2 flex items-center"
            onClick={handleAddProducts}
          >
            <i className="ri-add-line mr-2"></i>
            <span>Add Products</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeHeader;
