import * as React from "react";

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({ className, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      "block w-full px-4 py-2 rounded-md border border-gray-300 bg-white text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition disabled:cursor-not-allowed disabled:opacity-50 appearance-none",
      className
    )}
    {...props}
  />
));
Select.displayName = "Select";
export { Select }; 