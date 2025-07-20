import * as React from "react";

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

interface PaginationProps {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ page, pageCount, onPageChange }: PaginationProps) => (
  <div className="flex items-center space-x-2">
    <button className="px-3 py-1 rounded bg-gray-200" disabled={page === 1} onClick={() => onPageChange(page - 1)}>
      Prev
    </button>
    {Array.from({ length: pageCount }, (_, i) => (
      <button
        key={i}
        className={cn(
          "px-3 py-1 rounded",
          page === i + 1 ? "bg-primary text-white" : "bg-gray-100"
        )}
        onClick={() => onPageChange(i + 1)}
      >
        {i + 1}
      </button>
    ))}
    <button className="px-3 py-1 rounded bg-gray-200" disabled={page === pageCount} onClick={() => onPageChange(page + 1)}>
      Next
    </button>
  </div>
);

export { Pagination }; 