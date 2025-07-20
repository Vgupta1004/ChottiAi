import * as React from "react";

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

interface TooltipProps {
  text: string;
  children: React.ReactNode;
}

const Tooltip = ({ text, children }: TooltipProps) => {
  const [open, setOpen] = React.useState(false);
  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {children}
      {open && (
        <span className="absolute left-1/2 bottom-full mb-2 -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1 z-50 whitespace-nowrap">
          {text}
        </span>
      )}
    </span>
  );
};

export { Tooltip }; 