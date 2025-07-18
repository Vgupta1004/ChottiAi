import * as React from "react";

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

const Skeleton = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("animate-pulse bg-gray-200 rounded", className)} {...props} />
);

export { Skeleton }; 