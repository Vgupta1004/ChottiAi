import * as React from "react";

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

interface CarouselProps {
  children: React.ReactNode[];
}

const Carousel = ({ children }: CarouselProps) => {
  const [index, setIndex] = React.useState(0);
  const count = React.Children.count(children);
  const goTo = (i: number) => setIndex((i + count) % count);
  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="overflow-hidden rounded-lg border shadow">
        <div className="w-full h-48 flex items-center justify-center bg-gray-100">
          {children[index]}
        </div>
      </div>
      <button className="absolute left-2 top-1/2 -translate-y-1/2 bg-white rounded-full shadow p-2" onClick={() => goTo(index - 1)}>&lt;</button>
      <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-white rounded-full shadow p-2" onClick={() => goTo(index + 1)}>&gt;</button>
    </div>
  );
};

export { Carousel }; 