"use client";

import { useState, useEffect } from "react";

const messages = [
  "30 Tage freiwilliges Rückgaberecht",
  "Rücksendekosten übernehmen wir",
  "Versandkosten werden vor der Bestellung angezeigt",
];

export default function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (sessionStorage.getItem("announcement-dismissed") === "true") {
      setDismissed(true);
    }
  }, []);

  if (!mounted || dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem("announcement-dismissed", "true");
  };

  const duplicated = [...messages, ...messages];

  return (
    <div className="relative bg-gradient-to-r from-brand-600 via-brand-500 to-accent-500 text-white text-xs py-2 overflow-hidden shadow-xs">
      <div className="announcement-ticker">
        {duplicated.map((msg, i) => (
          <span key={i} className="mx-8 inline-flex items-center gap-1.5 whitespace-nowrap">
            {msg}
          </span>
        ))}
      </div>
      <button
        onClick={handleDismiss}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-white/70 hover:text-white transition-colors"
        aria-label="Schließen"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
