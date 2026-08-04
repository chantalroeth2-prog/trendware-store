"use client";

import { useState, useEffect } from "react";

interface Props {
  onChange: (view: "grid" | "list") => void;
}

export default function ViewToggle({ onChange }: Props) {
  const [view, setView] = useState<"grid" | "list">("grid");

  useEffect(() => {
    const saved = localStorage.getItem("shop-view");
    if (saved === "list" || saved === "grid") {
      setView(saved);
      onChange(saved);
    }
  }, [onChange]);

  const toggle = (v: "grid" | "list") => {
    setView(v);
    localStorage.setItem("shop-view", v);
    onChange(v);
  };

  return (
    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
      <button
        onClick={() => toggle("grid")}
        className={`p-2 transition-colors ${view === "grid" ? "bg-brand-600 text-white" : "text-gray-500 hover:text-gray-900"}`}
        aria-label="Grid-Ansicht"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      </button>
      <button
        onClick={() => toggle("list")}
        className={`p-2 transition-colors ${view === "list" ? "bg-brand-600 text-white" : "text-gray-500 hover:text-gray-900"}`}
        aria-label="Listen-Ansicht"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>
  );
}
