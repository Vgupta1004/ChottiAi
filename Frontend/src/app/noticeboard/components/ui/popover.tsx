import * as React from "react";

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

interface PopoverProps {
  children: React.ReactNode;
}

const Popover = ({ children }: PopoverProps) => {
  const [open, setOpen] = React.useState(false);
  return React.Children.map(children, child => {
    if (!React.isValidElement(child)) return child;
    if (child.type === PopoverTrigger) {
      return React.cloneElement(child as React.ReactElement<any>, {
        onClick: () => setOpen(o => !o),
        open,
      });
    }
    if (child.type === PopoverContent) {
      return open ? child : null;
    }
    return child;
  });
};

const PopoverTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { open?: boolean }>(({ className, open, ...props }, ref) => (
  <button ref={ref} className={cn("font-semibold text-primary", className)} aria-expanded={open} {...props} />
));
PopoverTrigger.displayName = "PopoverTrigger";

const PopoverContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("absolute mt-2 bg-white border rounded shadow min-w-[160px] z-50", className)} {...props} />
);

export { Popover, PopoverTrigger, PopoverContent }; 