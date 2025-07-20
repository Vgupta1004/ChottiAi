import * as React from "react";

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

interface DropdownMenuProps {
  children: React.ReactNode;
}

const DropdownMenu = ({ children }: DropdownMenuProps) => {
  const [open, setOpen] = React.useState(false);
  return React.Children.map(children, child => {
    if (!React.isValidElement(child)) return child;
    if (child.type === DropdownMenuTrigger) {
      return React.cloneElement(child as React.ReactElement<any>, {
        onClick: () => setOpen(o => !o),
        open,
      });
    }
    if (child.type === DropdownMenuContent) {
      return open ? child : null;
    }
    return child;
  });
};

const DropdownMenuTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { open?: boolean }>(({ className, open, ...props }, ref) => (
  <button ref={ref} className={cn("font-semibold text-primary", className)} aria-expanded={open} {...props} />
));
DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

const DropdownMenuContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("absolute mt-2 bg-white border rounded shadow min-w-[160px] z-50", className)} {...props} />
);

const DropdownMenuItem = ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("px-4 py-2 hover:bg-gray-100 cursor-pointer", className)} {...props}>{children}</div>
);

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem }; 