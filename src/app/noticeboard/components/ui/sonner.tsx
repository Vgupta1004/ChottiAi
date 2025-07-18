import * as React from "react";

interface SonnerProps {
  message: string;
  open: boolean;
  onClose: () => void;
}

const Sonner = ({ message, open, onClose }: SonnerProps) => (
  open ? (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-primary text-white px-6 py-3 rounded shadow z-50">
      {message}
      <button className="ml-4 text-white underline" onClick={onClose}>Close</button>
    </div>
  ) : null
);

export { Sonner }; 