import * as React from "react";

interface ChartProps {
  data: number[];
  labels?: string[];
}

const Chart = ({ data, labels }: ChartProps) => {
  const max = Math.max(...data, 1);
  return (
    <div className="w-full p-4 bg-white rounded-lg shadow border">
      <div className="flex items-end h-32 space-x-2">
        {data.map((v, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="bg-primary w-6" style={{ height: `${(v / max) * 100}%` }} />
            {labels && <span className="text-xs mt-1">{labels[i]}</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export { Chart }; 