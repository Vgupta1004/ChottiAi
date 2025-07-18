import * as React from "react";

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

interface ToggleGroupProps {
  options: { label: string; value: string }[];
  value: string[];
  onChange: (value: string[]) => void;
}

const ToggleGroup = ({ options, value, onChange }: ToggleGroupProps) => {
  const toggle = (val: string) => {
    if (value.includes(val)) {
      onChange(value.filter(v => v !== val));
    } else {
      onChange([...value, val]);
    }
  };
  return (
    <div className="flex gap-2">
      {options.map(opt => (
        <button
          key={opt.value}
          className={cn(
            "px-4 py-2 rounded border",
            value.includes(opt.value) ? "bg-primary text-white" : "bg-white text-gray-700"
          )}
          onClick={() => toggle(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
};

const ToggleGroupItem = ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button className="px-4 py-2 rounded border" {...props}>{children}</button>
);

export { ToggleGroup, ToggleGroupItem }; 