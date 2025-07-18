import * as React from "react";

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

interface ResizableProps {
  minWidth?: number;
  maxWidth?: number;
  children: React.ReactNode;
}

const Resizable = ({ minWidth = 100, maxWidth = 600, children }: ResizableProps) => {
  const [width, setWidth] = React.useState(300);
  const ref = React.useRef<HTMLDivElement>(null);
  const dragging = React.useRef(false);

  React.useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      const newWidth = Math.max(minWidth, Math.min(maxWidth, e.clientX - (ref.current?.getBoundingClientRect().left || 0)));
      setWidth(newWidth);
    };
    const onMouseUp = () => { dragging.current = false; };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [minWidth, maxWidth]);

  return (
    <div ref={ref} className="relative bg-gray-100" style={{ width }}>
      {children}
      <div
        className="absolute top-0 right-0 h-full w-2 cursor-ew-resize bg-gray-300"
        onMouseDown={() => { dragging.current = true; }}
      />
    </div>
  );
};

export { Resizable }; 