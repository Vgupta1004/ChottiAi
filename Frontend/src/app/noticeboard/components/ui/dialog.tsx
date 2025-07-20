import * as React from "react";

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

const Dialog = ({ open, onOpenChange, children }: DialogProps) => {
  return open ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={() => onOpenChange(false)} />
      <div className="relative z-10">{children}</div>
    </div>
  ) : null;
};

const DialogTrigger = ({ children, onClick }: { children: React.ReactNode; onClick: () => void }) => (
  <span onClick={onClick} className="inline-block cursor-pointer">{children}</span>
);

const DialogContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("bg-white rounded-lg shadow-xl p-6 min-w-[320px] max-w-lg", className)} {...props} />
);

const DialogTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h2 className={cn("text-xl font-bold mb-2", className)} {...props} />
);

const DialogDescription = ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn("text-gray-600 mb-4", className)} {...props} />
);

export { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription }; 