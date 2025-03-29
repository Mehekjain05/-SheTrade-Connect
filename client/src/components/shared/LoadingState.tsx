import { Skeleton } from "@/components/ui/skeleton";

interface LoadingStateProps {
  type?: "card" | "table" | "metrics";
  count?: number;
}

const LoadingState = ({ type = "card", count = 4 }: LoadingStateProps) => {
  if (type === "table") {
    return (
      <div className="w-full space-y-3">
        <div className="flex items-center">
          <Skeleton className="h-8 w-full" />
        </div>
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="flex items-center space-x-4">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-6 flex-1" />
          </div>
        ))}
      </div>
    );
  }

  if (type === "metrics") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="bg-white p-4 rounded-lg border border-neutral-light">
            <div className="flex items-center justify-between">
              <div>
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-8 w-16 mb-1" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Default card loading state
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-white p-4 rounded-lg border border-neutral-light">
          <div className="space-y-3">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <div className="pt-2">
              <Skeleton className="h-8 w-24" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingState;
