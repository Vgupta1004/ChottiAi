import * as React from "react";

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

const Breadcrumb = ({ children, className, ...props }: React.HTMLAttributes<HTMLElement>) => (
  <nav className={cn("flex items-center text-sm text-gray-500", className)} aria-label="Breadcrumb" {...props}>
    <ol className="flex items-center space-x-2">{children}</ol>
  </nav>
);

const BreadcrumbItem = ({ children, className, ...props }: React.LiHTMLAttributes<HTMLLIElement>) => (
  <li className={cn("flex items-center", className)} {...props}>{children}</li>
);

const BreadcrumbSeparator = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
  <span className={cn("mx-2 text-gray-400", className)} {...props}>/</span>
);

export { Breadcrumb, BreadcrumbItem, BreadcrumbSeparator }; 