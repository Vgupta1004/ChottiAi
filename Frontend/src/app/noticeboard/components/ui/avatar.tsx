import * as React from "react";

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

const Avatar = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("inline-block w-10 h-10 rounded-full bg-gray-200 overflow-hidden", className)} {...props} />
));
Avatar.displayName = "Avatar";

const AvatarImage = ({ src, alt, className, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <img src={src} alt={alt} className={cn("w-full h-full object-cover", className)} {...props} />
);
const AvatarFallback = ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex items-center justify-center w-full h-full text-gray-500", className)} {...props}>{children}</div>
);

export { Avatar, AvatarImage, AvatarFallback }; 