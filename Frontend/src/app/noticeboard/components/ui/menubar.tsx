import * as React from "react";

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

const Menubar = ({ children, className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
  <ul className={cn("flex space-x-4 bg-gray-100 p-2 rounded", className)} {...props}>{children}</ul>
);

const MenubarItem = ({ children, className, ...props }: React.LiHTMLAttributes<HTMLLIElement>) => (
  <li className={cn("px-4 py-2 cursor-pointer hover:bg-primary hover:text-white rounded transition", className)} {...props}>{children}</li>
);

export { Menubar, MenubarItem }; 