import * as React from "react";

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(({ className, ...props }, ref) => (
  <input
    type="range"
    ref={ref}
    className={cn("w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer", className)}
    {...props}
  />
));
Slider.displayName = "Slider";
export { Slider }; 