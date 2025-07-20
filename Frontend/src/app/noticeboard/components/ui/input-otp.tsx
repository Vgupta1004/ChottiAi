import * as React from "react";

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

interface InputOtpProps {
  length?: number;
  onChange?: (otp: string) => void;
}

const InputOtp = ({ length = 6, onChange }: InputOtpProps) => {
  const [values, setValues] = React.useState<string[]>(Array(length).fill(""));
  const inputs = React.useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (i: number, v: string) => {
    const newVals = [...values];
    newVals[i] = v.slice(-1);
    setValues(newVals);
    if (onChange) onChange(newVals.join(""));
    if (v && i < length - 1) inputs.current[i + 1]?.focus();
  };

  return (
    <div className="flex gap-2">
      {values.map((v, i) => (
        <input
          key={i}
          ref={el => { inputs.current[i] = el; }}
          className="w-10 h-10 text-center border rounded"
          value={v}
          onChange={e => handleChange(i, e.target.value)}
          maxLength={1}
        />
      ))}
    </div>
  );
};

export { InputOtp }; 