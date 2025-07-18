import * as React from "react";

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "block w-full px-4 py-3 rounded-md border border-gray-300 bg-white text-black shadow-sm placeholder:text-black focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition min-h-32 disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";
export { Textarea }; 