import { cn } from "@/lib/utils";

interface BadgeIconProps {
  icon: string;
  color: string;
  className?: string;
}

export const BadgeIcon = ({
  icon,
  color,
  className,
}: BadgeIconProps) => {
  // Map color to tailwind classes
  const colorClasses: Record<string, { bg: string, text: string }> = {
    primary: { bg: "bg-primary bg-opacity-10", text: "text-primary" },
    secondary: { bg: "bg-secondary bg-opacity-10", text: "text-secondary" },
    accent: { bg: "bg-accent bg-opacity-10", text: "text-accent" },
    success: { bg: "bg-success bg-opacity-10", text: "text-success" },
    error: { bg: "bg-error bg-opacity-10", text: "text-error" }
  };

  const { bg, text } = colorClasses[color] || colorClasses.primary;
  
  return (
    <div className={cn(
      "w-10 h-10 rounded-full flex items-center justify-center",
      bg,
      text,
      className
    )}>
      <i className={icon}></i>
    </div>
  );
};
