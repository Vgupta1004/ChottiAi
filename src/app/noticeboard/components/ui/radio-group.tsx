import * as React from "react";

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

interface RadioGroupProps {
  name: string;
  options: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
}

const RadioGroup = ({ name, options, value, onChange }: RadioGroupProps) => (
  <div className="flex flex-col gap-2">
    {options.map(opt => (
      <label key={opt.value} className="inline-flex items-center gap-2 cursor-pointer">
        <input
          type="radio"
          name={name}
          value={opt.value}
          checked={value === opt.value}
          onChange={() => onChange(opt.value)}
          className="form-radio text-primary"
        />
        <span>{opt.label}</span>
      </label>
    ))}
  </div>
);

const RadioGroupItem = ({ children, ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
  <label className="inline-flex items-center gap-2 cursor-pointer">
    <input type="radio" {...props} className="form-radio text-primary" />
    <span>{children}</span>
  </label>
);

export { RadioGroup, RadioGroupItem }; 