"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

function getTimeUntilSunday(): { hours: number; minutes: number; seconds: number; total: number } {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Sunday
  // Calculate days until end of Sunday (23:59:59)
  const daysUntilSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
  const target = new Date(now);
  target.setDate(now.getDate() + daysUntilSunday);
  target.setHours(23, 59, 59, 999);

  const diff = target.getTime() - now.getTime();
  if (diff <= 0) {
    return { hours: 0, minutes: 0, seconds: 0, total: 0 };
  }

  const totalSeconds = Math.floor(diff / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { hours, minutes, seconds, total: totalSeconds };
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

export default function FlashSaleBanner() {
  const [dismissed, setDismissed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [time, setTime] = useState(getTimeUntilSunday);

  useEffect(() => {
    setMounted(true);
    if (sessionStorage.getItem("flash-sale-dismissed") === "true") {
      setDismissed(true);
    } else {
      // Trigger entrance animation after a brief delay
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setVisible(true);
        });
      });
    }
  }, []);

  useEffect(() => {
    if (dismissed) return;
    const interval = setInterval(() => {
      setTime(getTimeUntilSunday());
    }, 1000);
    return () => clearInterval(interval);
  }, [dismissed]);

  const handleDismiss = useCallback(() => {
    setVisible(false);
    // Wait for exit animation before fully removing
    setTimeout(() => {
      setDismissed(true);
      sessionStorage.setItem("flash-sale-dismissed", "true");
    }, 300);
  }, []);

  if (!mounted || dismissed) return null;

  return (
    <div
      className={`relative z-[60] w-full bg-gradient-to-r from-teal-900 via-teal-800 to-teal-900 text-white shadow-lg transition-all duration-300 ease-out ${
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-full"
      }`}
      role="banner"
      aria-label="Flash Sale"
    >
      {/* Subtle shimmer overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent bg-[length:200%_100%] animate-shimmer pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3">
        <div className="flex items-center justify-center gap-3 sm:gap-5">
          {/* Sale text */}
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap justify-center">
            <span className="text-xs sm:text-sm font-semibold tracking-wide whitespace-nowrap">
              <span className="hidden sm:inline">&#9889; FLASH SALE &ndash; Bis zu 30% sparen</span>
              <span className="sm:hidden">&#9889; FLASH SALE &ndash; 30%</span>
            </span>

            <span className="hidden sm:inline text-white/40">|</span>

            {/* Countdown */}
            <span className="text-xs sm:text-sm font-medium whitespace-nowrap">
              <span className="hidden sm:inline">Endet in: </span>
              <span className="inline-flex items-center gap-0.5 font-mono font-bold tracking-wider">
                <span className="bg-white/15 rounded px-1.5 py-0.5 text-xs sm:text-sm">
                  {pad(time.hours)}
                </span>
                <span className="text-white/60">:</span>
                <span className="bg-white/15 rounded px-1.5 py-0.5 text-xs sm:text-sm">
                  {pad(time.minutes)}
                </span>
                <span className="text-white/60">:</span>
                <span className="bg-white/15 rounded px-1.5 py-0.5 text-xs sm:text-sm">
                  {pad(time.seconds)}
                </span>
              </span>
            </span>
          </div>

          {/* CTA button */}
          <Link
            href="/shop"
            className="flex-shrink-0 inline-flex items-center gap-1.5 bg-brand-400 text-white text-xs sm:text-sm font-bold px-3 sm:px-4 py-1.5 rounded-full hover:bg-brand-300 transition-all duration-200 hover:shadow-md hover:shadow-brand-400/20"
          >
            <span className="whitespace-nowrap">Jetzt shoppen</span>
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>

          {/* Dismiss button */}
          <button
            onClick={handleDismiss}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-1.5 text-white/50 hover:text-white transition-colors rounded-full hover:bg-white/10"
            aria-label="Banner schließen"
          >
            <svg
              className="w-4 h-4"
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
        </div>
      </div>
    </div>
  );
}
