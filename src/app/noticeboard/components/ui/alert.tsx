import * as React from "react";

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

const Alert = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md", className)} {...props} />
));
Alert.displayName = "Alert";

const AlertTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h4 className={cn("font-bold text-yellow-800 mb-1", className)} {...props} />
);
const AlertDescription = ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn("text-yellow-700", className)} {...props} />
);

export { Alert, AlertTitle, AlertDescription }; 