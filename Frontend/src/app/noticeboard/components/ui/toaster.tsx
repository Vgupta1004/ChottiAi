import * as React from "react";

const Toaster = ({ children }: { children: React.ReactNode }) => (
  <div className="fixed bottom-4 right-4 z-50 space-y-2">{children}</div>
);

export { Toaster }; 