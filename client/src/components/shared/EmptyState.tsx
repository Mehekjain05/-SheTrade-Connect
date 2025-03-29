import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: string;
}

const EmptyState = ({
  title,
  description,
  actionLabel,
  onAction,
  icon = "ri-inbox-line"
}: EmptyStateProps) => {
  return (
    <Card className="w-full">
      <CardContent className="pt-10 pb-10 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-neutral-lightest flex items-center justify-center text-neutral-medium mb-4">
          <i className={`${icon} text-3xl`}></i>
        </div>
        <h3 className="text-xl font-medium mb-2">{title}</h3>
        <p className="text-neutral-medium max-w-md mb-6">{description}</p>
        {actionLabel && onAction && (
          <Button 
            className="bg-primary hover:bg-primary-dark text-white"
            onClick={onAction}
          >
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default EmptyState;
