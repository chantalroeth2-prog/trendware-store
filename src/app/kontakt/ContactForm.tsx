"use client";

import { useState, FormEvent } from "react";

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Fehler beim Senden");

      setStatus("sent");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="glass-card p-6 text-center">
        <p className="text-green-600 font-semibold text-lg mb-2">
          Nachricht gesendet!
        </p>
        <p className="text-gray-500 text-sm">
          Vielen Dank für deine Nachricht. Wir melden uns
          schnellstmöglich bei dir.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-4 text-sm text-brand-600 underline hover:text-brand-700"
        >
          Weitere Nachricht senden
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-600 mb-1">
          Name *
        </label>
        <input
          type="text"
          id="name"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
          placeholder="Dein Name"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-1">
          E-Mail *
        </label>
        <input
          type="email"
          id="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
          placeholder="deine@email.de"
        />
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-600 mb-1">
          Betreff *
        </label>
        <input
          type="text"
          id="subject"
          required
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
          placeholder="Worum geht es?"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-600 mb-1">
          Nachricht *
        </label>
        <textarea
          id="message"
          required
          rows={6}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none resize-vertical"
          placeholder="Deine Nachricht..."
        />
      </div>

      {status === "error" && (
        <p className="text-red-500 text-sm">
          Leider ist ein Fehler aufgetreten. Bitte versuche es erneut.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full btn-primary py-3"
      >
        {status === "sending" ? "Wird gesendet..." : "Nachricht senden"}
      </button>
    </form>
  );
}
