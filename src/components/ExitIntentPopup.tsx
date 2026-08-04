"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export default function ExitIntentPopup() {
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);
  const triggered = useRef(false);
  const [copied, setCopied] = useState(false);

  const dismiss = useCallback(() => {
    setAnimating(false);
    // Wait for the fade-out transition to finish before unmounting
    setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem("exitPopupDismissed", "1");
    }, 300);
  }, []);

  const showPopup = useCallback(() => {
    if (triggered.current) return;
    if (typeof window !== "undefined" && sessionStorage.getItem("exitPopupDismissed")) return;
    triggered.current = true;
    setVisible(true);
    // Trigger fade-in on next frame so the transition plays
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setAnimating(true);
      });
    });
  }, []);

  useEffect(() => {
    // Desktop: detect mouse moving to top of viewport (exit intent)
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        showPopup();
      }
    };

    // Mobile: trigger after 30 seconds on page
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    let mobileTimer: ReturnType<typeof setTimeout> | null = null;

    if (isMobile) {
      mobileTimer = setTimeout(() => {
        showPopup();
      }, 30000);
    }

    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
      if (mobileTimer) clearTimeout(mobileTimer);
    };
  }, [showPopup]);

  // Escape key to close
  useEffect(() => {
    if (!visible) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        dismiss();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [visible, dismiss]);

  const copyCode = () => {
    navigator.clipboard.writeText("WILLKOMMEN10").catch(() => {
      // Fallback: select text in a temporary input
    });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[70] flex items-center justify-center p-4 transition-opacity duration-300 ${
        animating ? "opacity-100" : "opacity-0"
      }`}
      onClick={dismiss}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Popup card */}
      <div
        className={`relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transition-all duration-300 ${
          animating
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-4"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top gradient accent bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-brand-400 via-brand-500 to-brand-400" />

        <div className="p-8 pt-6 text-center">
          {/* Close button */}
          <button
            onClick={dismiss}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
            aria-label="Schliessen"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Gift emoji */}
          <div className="text-5xl mb-5">
            <span role="img" aria-label="Geschenk">
              🎁
            </span>
          </div>

          {/* Headline */}
          <h2 className="font-display text-2xl sm:text-[1.65rem] font-bold text-gray-900 leading-tight mb-3">
            Warte! 🎁 10% Rabatt auf deine
            <br />
            <span className="bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent">
              erste Bestellung
            </span>
          </h2>

          <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-xs mx-auto">
            Sichere dir exklusiv 10&nbsp;% Rabatt. Gib einfach den Code an der
            Kasse ein.
          </p>

          {/* Discount code copyable box */}
          <button
            onClick={copyCode}
            className="group w-full bg-gradient-to-br from-brand-50 to-brand-100 border-2 border-dashed border-brand-300 rounded-xl px-6 py-4 mb-5 hover:border-brand-500 transition-all cursor-pointer"
          >
            <span className="font-mono text-2xl font-bold bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent tracking-[0.2em]">
              WILLKOMMEN10
            </span>
            <p className="text-xs text-gray-500 mt-1.5 group-hover:text-brand-600 transition-colors">
              {copied ? (
                <span className="text-green-600 font-medium">
                  ✓ Kopiert!
                </span>
              ) : (
                "Klicken zum Kopieren"
              )}
            </p>
          </button>

          {/* CTA button */}
          <a
            href="/shop"
            onClick={dismiss}
            className="block w-full rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-6 py-3.5 text-base font-semibold text-white text-center shadow-lg shadow-brand-500/25 hover:shadow-xl hover:shadow-brand-500/30 hover:from-brand-500 hover:to-brand-400 transition-all"
          >
            Jetzt einlösen
          </a>

          {/* Dismiss link */}
          <button
            onClick={dismiss}
            className="mt-4 text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            Nein danke
          </button>
        </div>
      </div>
    </div>
  );
}
