"use client";

import { useState } from "react";

interface DropdownProps {
  title: string;
  items?: Array<{
    id: number;
    title: string;
    price: number;
    time?: string;
    description?: string;
  }>;
}

const Dropdown = ({ title, items = [] }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between border-b border-blush-deep py-3 text-left"
      >
        <span className="font-display text-2xl text-ink md:text-3xl">{title}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className={`h-5 w-5 transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`}
        >
          <path
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <ul className="mt-2 flex flex-col">
          {items.map((item) => (
            <li key={`${item.id}-${item.title}-${item.time ?? ""}`} className="border-b border-blush-deep/50 py-4">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="text-base font-medium text-ink">{item.title}</h3>
                <span className="shrink-0 text-accent-deep">{item.price}€</span>
              </div>
              {item.time && <p className="mt-1 text-sm text-ink-soft">{item.time}</p>}
              {item.description && <p className="mt-2 text-sm text-ink-soft">{item.description}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
