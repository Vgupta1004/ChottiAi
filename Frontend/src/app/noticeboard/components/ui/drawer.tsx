import * as React from "react";

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

interface DrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

const Drawer = ({ open, onOpenChange, children }: DrawerProps) => (
  open ? (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="fixed inset-0 bg-black/40" onClick={() => onOpenChange(false)} />
      <div className="relative z-10 w-80 h-full bg-white shadow-lg p-6 animate-slide-in-right">{children}</div>
    </div>
  ) : null
);

const DrawerTrigger = ({ children, onClick }: { children: React.ReactNode; onClick: () => void }) => (
  <span onClick={onClick} className="inline-block cursor-pointer">{children}</span>
);

const DrawerContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("w-full h-full", className)} {...props} />
);

export { Drawer, DrawerTrigger, DrawerContent }; 