import * as React from "react";

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

interface ToggleProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const Toggle = ({ active, onClick, children }: ToggleProps) => (
  <button
    className={cn(
      "px-4 py-2 rounded border",
      active ? "bg-primary text-white" : "bg-white text-gray-700"
    )}
    onClick={onClick}
  >
    {children}
  </button>
);

export { Toggle }; 