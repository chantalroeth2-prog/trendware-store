"use client";

import { useState, FormEvent } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(data.message || "Erfolgreich angemeldet!");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Anmeldung fehlgeschlagen.");
      }
    } catch {
      setStatus("error");
      setMessage("Verbindungsfehler. Bitte versuche es erneut.");
    }
  };

  if (status === "success") {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700 text-sm max-w-md mx-auto">
        {message}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Deine E-Mail-Adresse"
        className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-brand-500"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="btn-accent px-6 py-3 text-sm whitespace-nowrap disabled:opacity-50"
      >
        {status === "loading" ? "Wird gesendet..." : "Anmelden"}
      </button>
      {status === "error" && (
        <p className="text-red-600 text-xs sm:col-span-2">{message}</p>
      )}
    </form>
  );
}
