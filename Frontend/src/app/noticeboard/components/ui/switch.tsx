import * as React from "react";

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(({ className, ...props }, ref) => (
  <label className="inline-flex items-center cursor-pointer">
    <input type="checkbox" ref={ref} className="sr-only peer" {...props} />
    <div className={cn("w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-primary transition relative", className)}>
      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-5" />
    </div>
  </label>
));
Switch.displayName = "Switch";
export { Switch }; 