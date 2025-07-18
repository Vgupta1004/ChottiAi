import * as React from "react";

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

interface CommandProps {
  options: string[];
  onSelect: (option: string) => void;
}

const Command = ({ options, onSelect }: CommandProps) => {
  const [query, setQuery] = React.useState("");
  const filtered = options.filter(o => o.toLowerCase().includes(query.toLowerCase()));
  return (
    <div className="bg-white border rounded-lg shadow p-4 w-64">
      <input
        className="w-full px-3 py-2 border rounded mb-2"
        placeholder="Type a command..."
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      <ul className="divide-y">
        {filtered.map(opt => (
          <li key={opt} className="py-2 cursor-pointer hover:bg-gray-100" onClick={() => onSelect(opt)}>{opt}</li>
        ))}
      </ul>
    </div>
  );
};

export { Command }; 