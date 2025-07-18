import * as React from "react";

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

interface CollapsibleProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const Collapsible = ({ children, defaultOpen = false }: CollapsibleProps) => {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <div>
      {React.Children.map(children, child => {
        if (!React.isValidElement(child)) return child;
        if (child.type === CollapsibleTrigger) {
          return React.cloneElement(child as React.ReactElement<any>, {
            onClick: () => setOpen(o => !o),
            open,
          });
        }
        return open ? child : null;
      })}
    </div>
  );
};

interface CollapsibleTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  open?: boolean;
}

const CollapsibleTrigger = React.forwardRef<HTMLButtonElement, CollapsibleTriggerProps>(({ className, open, ...props }, ref) => (
  <button ref={ref} className={cn("font-semibold text-primary", className)} aria-expanded={open} {...props} />
));
CollapsibleTrigger.displayName = "CollapsibleTrigger";

export { Collapsible, CollapsibleTrigger }; 