import * as React from "react";

interface ProgressProps {
  value: number;
}

const Progress = ({ value }: ProgressProps) => (
  <div className="w-full bg-gray-200 rounded h-3">
    <div
      className="bg-primary h-3 rounded"
      style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
    />
  </div>
);

export { Progress }; 