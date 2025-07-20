import * as React from "react";

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  maxHeight?: number;
}

const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(({ className, maxHeight = 300, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("overflow-y-auto", className)}
    style={{ maxHeight, ...props.style }}
    {...props}
  />
));
ScrollArea.displayName = "ScrollArea";
export { ScrollArea }; 