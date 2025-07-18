import * as React from "react";

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

const daysShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const Calendar = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = new Date(year, month, 1).getDay();
  const days: (number | null)[] = Array(firstDay).fill(null).concat(
    Array.from({ length: daysInMonth }, (_, i) => i + 1)
  );
  while (days.length % 7 !== 0) days.push(null);

  return (
    <div className="inline-block p-4 bg-white rounded-lg shadow border">
      <div className="grid grid-cols-7 gap-1 mb-2">
        {daysShort.map((d) => (
          <div key={d} className="text-xs font-bold text-center text-gray-500">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((d, i) => (
          <div key={i} className={cn("h-8 w-8 flex items-center justify-center text-sm rounded", d === today.getDate() ? "bg-primary text-white" : "text-gray-700")}>{d || ""}</div>
        ))}
      </div>
    </div>
  );
};

export { Calendar }; 