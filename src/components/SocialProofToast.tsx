"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

const CITIES = [
  "Berlin", "Hamburg", "München", "Köln", "Frankfurt",
  "Stuttgart", "Düsseldorf", "Leipzig", "Dortmund", "Essen",
  "Bremen", "Dresden", "Hannover", "Nürnberg", "Duisburg",
  "Bochum", "Wuppertal", "Bielefeld", "Bonn", "Münster",
  "Mannheim", "Karlsruhe", "Augsburg", "Wiesbaden", "Freiburg",
];

const NAMES = [
  "Anna", "Lisa", "Sarah", "Laura", "Julia",
  "Marie", "Sophie", "Lena", "Emma", "Mia",
  "Max", "Paul", "Leon", "Tim", "Jonas",
  "Lukas", "Felix", "Ben", "David", "Tom",
];

const MINUTES = [2, 3, 5, 7, 8, 11, 14, 18, 22, 27];

interface ToastProduct {
  title: string;
  image: string;
  price: number;
  slug: string;
}

interface Props {
  products: ToastProduct[];
}

export default function SocialProofToast({ products }: Props) {
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState<{
    name: string;
    city: string;
    product: ToastProduct;
    minutes: number;
  } | null>(null);

  const pick = useCallback(<T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)], []);

  useEffect(() => {
    if (products.length === 0) return;

    const show = () => {
      setCurrent({
        name: pick(NAMES),
        city: pick(CITIES),
        product: pick(products),
        minutes: pick(MINUTES),
      });
      setVisible(true);
      setTimeout(() => setVisible(false), 5000);
    };

    // First toast after 15-25 seconds
    const initialDelay = 15000 + Math.random() * 10000;
    const initialTimer = setTimeout(() => {
      show();
    }, initialDelay);

    // Recurring toasts every 25-45 seconds
    const interval = setInterval(() => {
      show();
    }, 25000 + Math.random() * 20000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [products, pick]);

  if (!current) return null;

  return (
    <div
      className={`fixed bottom-4 left-4 z-[60] max-w-sm transform transition-all duration-500 ${
        visible
          ? "translate-x-0 opacity-100"
          : "-translate-x-full opacity-0"
      }`}
    >
      <div className="bg-white/95 backdrop-blur-xl border border-gray-300 rounded-xl p-3 shadow-2xl flex items-center gap-3">
        <Image
          src={current.product.image}
          alt=""
          width={48}
          height={48}
          className="rounded-lg object-cover flex-shrink-0"
        />
        <div className="min-w-0">
          <p className="text-xs text-gray-600 leading-tight">
            <span className="font-semibold text-gray-900">{current.name}</span>{" "}
            aus {current.city} hat
          </p>
          <p className="text-xs text-brand-600 font-medium truncate">
            {current.product.title}
          </p>
          <p className="text-[10px] text-gray-500">
            vor {current.minutes} Minuten gekauft
          </p>
        </div>
        <button
          onClick={() => setVisible(false)}
          className="text-gray-400 hover:text-gray-600 flex-shrink-0 p-1"
          aria-label="Schließen"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
