import * as React from "react";

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "success" | "danger" | "warning" | "info";
}

const variantClasses: Record<string, string> = {
  default: "bg-primary text-black",
  secondary: "bg-gray-200 text-black",
  success: "bg-green-500 text-black",
  danger: "bg-red-500 text-black",
  warning: "bg-yellow-400 text-black",
  info: "bg-blue-400 text-black",
};

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(({ className, variant = "default", ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      "inline-block px-3 py-1 rounded-full text-xs font-semibold",
      variantClasses[variant],
      className
    )}
    {...props}
  />
));
Badge.displayName = "Badge";
export { Badge }; 