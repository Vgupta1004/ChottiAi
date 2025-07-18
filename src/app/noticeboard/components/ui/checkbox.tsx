import * as React from "react";

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(({ className, ...props }, ref) => (
  <input
    type="checkbox"
    ref={ref}
    className={cn(
      "h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary focus:ring-2",
      className
    )}
    {...props}
  />
));
Checkbox.displayName = "Checkbox";
export { Checkbox }; 