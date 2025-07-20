import * as React from "react";

interface ToastProps {
  message: string;
  open: boolean;
  onClose: () => void;
}

const Toast = ({ message, open, onClose }: ToastProps) => (
  open ? (
    <div className="fixed bottom-4 right-4 bg-primary text-white px-6 py-3 rounded shadow z-50">
      {message}
      <button className="ml-4 text-white underline" onClick={onClose}>Close</button>
    </div>
  ) : null
);

export { Toast }; 