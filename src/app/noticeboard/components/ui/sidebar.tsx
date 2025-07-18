import * as React from "react";

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

const Sidebar = ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <aside className={cn("w-64 h-full bg-gray-100 p-4 flex flex-col", className)} {...props}>{children}</aside>
);

export { Sidebar }; 