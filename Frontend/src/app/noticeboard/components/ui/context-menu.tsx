import * as React from "react";

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

interface ContextMenuProps {
  items: { label: string; onClick: () => void }[];
  children: React.ReactNode;
}

const ContextMenu = ({ items, children }: ContextMenuProps) => {
  const [visible, setVisible] = React.useState(false);
  const [pos, setPos] = React.useState({ x: 0, y: 0 });
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClick = () => setVisible(false);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  return (
    <div
      ref={ref}
      onContextMenu={e => {
        e.preventDefault();
        setPos({ x: e.clientX, y: e.clientY });
        setVisible(true);
      }}
      className="inline-block"
    >
      {children}
      {visible && (
        <ul
          className="fixed z-50 bg-white border rounded shadow min-w-[120px]"
          style={{ left: pos.x, top: pos.y }}
        >
          {items.map((item, i) => (
            <li
              key={i}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => { item.onClick(); setVisible(false); }}
            >
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const ContextMenuItem = ({ children, ...props }: React.LiHTMLAttributes<HTMLLIElement>) => (
  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" {...props}>{children}</li>
);

export { ContextMenu, ContextMenuItem }; 