import * as React from "react";

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClick: () => void;
}

const AccordionItem = ({ title, children, isOpen, onClick }: AccordionItemProps) => (
  <div className="border-b">
    <button
      className="w-full flex justify-between items-center py-4 text-left font-semibold focus:outline-none"
      onClick={onClick}
    >
      {title}
      <span>{isOpen ? "-" : "+"}</span>
    </button>
    {isOpen && <div className="pb-4 pl-2 text-gray-700">{children}</div>}
  </div>
);

interface AccordionProps {
  items: { title: string; content: React.ReactNode }[];
}

const Accordion = ({ items }: AccordionProps) => {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);
  return (
    <div className="rounded-lg border divide-y">
      {items.map((item, idx) => (
        <AccordionItem
          key={idx}
          title={item.title}
          isOpen={openIndex === idx}
          onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
        >
          {item.content}
        </AccordionItem>
      ))}
    </div>
  );
};

export { Accordion, AccordionItem }; 