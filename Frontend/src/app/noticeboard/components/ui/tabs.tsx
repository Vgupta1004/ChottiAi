import * as React from "react";

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

interface TabsProps {
  tabs: { label: string; content: React.ReactNode }[];
}

const Tabs = ({ tabs }: TabsProps) => {
  const [active, setActive] = React.useState(0);
  return (
    <div>
      <div className="flex border-b mb-4">
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            className={cn(
              "px-4 py-2 -mb-px border-b-2 font-medium",
              active === i ? "border-primary text-primary" : "border-transparent text-gray-500"
            )}
            onClick={() => setActive(i)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div>{tabs[active].content}</div>
    </div>
  );
};

const Tab = ({ children }: { children: React.ReactNode }) => <>{children}</>;

export { Tabs, Tab }; 