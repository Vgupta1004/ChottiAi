import * as React from "react";

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

const Sheet = ({ open, onOpenChange, children }: SheetProps) => (
  open ? (
    <div className="fixed inset-0 z-50 flex justify-start">
      <div className="fixed inset-0 bg-black/40" onClick={() => onOpenChange(false)} />
      <div className="relative z-10 w-80 h-full bg-white shadow-lg p-6 animate-slide-in-left">{children}</div>
    </div>
  ) : null
);

const SheetTrigger = ({ children, onClick }: { children: React.ReactNode; onClick: () => void }) => (
  <span onClick={onClick} className="inline-block cursor-pointer">{children}</span>
);

const SheetContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("w-full h-full", className)} {...props} />
);

export { Sheet, SheetTrigger, SheetContent }; 