import * as React from "react";

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

interface AlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

const AlertDialog = ({ open, onOpenChange, children }: AlertDialogProps) => (
  open ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={() => onOpenChange(false)} />
      <div className="relative z-10">{children}</div>
    </div>
  ) : null
);

const AlertDialogTrigger = ({ children, onClick }: { children: React.ReactNode; onClick: () => void }) => (
  <span onClick={onClick} className="inline-block cursor-pointer">{children}</span>
);

const AlertDialogContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("bg-white rounded-lg shadow-xl p-6 min-w-[320px] max-w-lg", className)} {...props} />
);

const AlertDialogTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h2 className={cn("text-xl font-bold mb-2", className)} {...props} />
);

const AlertDialogDescription = ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn("text-gray-600 mb-4", className)} {...props} />
);

const AlertDialogAction = ({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button className={cn("bg-primary text-white px-4 py-2 rounded-md mr-2", className)} {...props} />
);

const AlertDialogCancel = ({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button className={cn("bg-gray-200 text-gray-800 px-4 py-2 rounded-md", className)} {...props} />
);

export { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel }; 