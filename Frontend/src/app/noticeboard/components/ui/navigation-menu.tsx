import * as React from "react";

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

const NavigationMenu = ({ children, className, ...props }: React.HTMLAttributes<HTMLElement>) => (
  <nav className={cn("flex space-x-6", className)} {...props}>{children}</nav>
);

const NavigationMenuItem = ({ children, className, ...props }: React.LiHTMLAttributes<HTMLLIElement>) => (
  <li className={cn("px-3 py-2 cursor-pointer hover:bg-primary hover:text-white rounded transition", className)} {...props}>{children}</li>
);

export { NavigationMenu, NavigationMenuItem }; 