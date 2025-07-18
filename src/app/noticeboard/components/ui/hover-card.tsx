import * as React from "react";

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

interface HoverCardProps {
  trigger: React.ReactNode;
  content: React.ReactNode;
}

const HoverCard = ({ trigger, content }: HoverCardProps) => {
  const [open, setOpen] = React.useState(false);
  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {trigger}
      {open && (
        <div className="absolute left-1/2 top-full mt-2 -translate-x-1/2 bg-white border rounded shadow p-4 z-50 min-w-[200px]">
          {content}
        </div>
      )}
    </span>
  );
};

const HoverCardContent = ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("p-4", className)} {...props}>{children}</div>
);

export { HoverCard, HoverCardContent }; 