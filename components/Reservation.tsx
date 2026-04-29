"use client";

// ─────────────────────────────────────────────────────────────
// Reservation section — booking form
// Submits to /api/reserve which:
//   1. Saves the data to Supabase (reservations table)
//   2. Sends a WhatsApp message to the owner via Twilio
// ─────────────────────────────────────────────────────────────

import { useState, useEffect, useRef } from "react";
import { CalendarDays, Clock, Users, Phone, User, MessageSquare, CheckCircle } from "lucide-react";
import clsx from "clsx";

type FormData = {
  full_name: string;
  phone: string;
  date: string;
  time: string;
  guests: string;
  special_requests: string;
};

const initialForm: FormData = {
  full_name: "",
  phone: "",
  date: "",
  time: "",
  guests: "2",
  special_requests: "",
};

// Available booking times
const timeSlots = [
  "07:00", "07:30", "08:00", "08:30", "09:00", "09:30",
  "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30", "18:00", "18:30",
  "19:00", "19:30", "20:00", "20:30",
];

export default function Reservation() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) entry.target.classList.add("visible");
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/reserve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("success");
      setForm(initialForm);
    } catch {
      setErrorMsg("Network error. Please check your connection and try again.");
      setStatus("error");
    }
  };

  // Get today's date in YYYY-MM-DD format to set as minimum date
  const today = new Date().toISOString().split("T")[0];

  return (
    <section className="bg-dark py-24 sm:py-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* ── Section header ────────────────────────────────── */}
        <div ref={sectionRef} className="reveal text-center mb-14">
          <p className="text-accent text-sm font-medium tracking-widest uppercase mb-4">
            Join Us
          </p>
          <h2 className="text-4xl sm:text-5xl font-serif text-white leading-tight mb-4">
            Reserve a Table
          </h2>
          <p className="text-white/50 text-base max-w-md mx-auto">
            Book your spot at Kawa House. We&apos;ll send a WhatsApp confirmation
            to your number once you submit.
          </p>
        </div>

        {/* ── Success state ─────────────────────────────────── */}
        {status === "success" ? (
          <div className="max-w-md mx-auto text-center py-16 reveal visible">
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-green-400" />
            </div>
            <h3 className="text-white font-serif text-3xl mb-3">You&apos;re booked!</h3>
            <p className="text-white/60 text-base mb-8">
              Your reservation is confirmed. We&apos;ll see you at Kawa House!
              Check your WhatsApp for details.
            </p>
            <button
              onClick={() => setStatus("idle")}
              className="text-accent underline underline-offset-4 text-sm hover:text-accent-light transition-colors"
            >
              Make another reservation
            </button>
          </div>
        ) : (
          /* ── Reservation form ──────────────────────────────── */
          <form
            onSubmit={handleSubmit}
            className="bg-dark-card rounded-3xl border border-white/10 p-6 sm:p-10 max-w-3xl mx-auto"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

              {/* Full Name */}
              <FormField label="Full Name" icon={<User size={16} />}>
                <input
                  type="text"
                  name="full_name"
                  value={form.full_name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Amina Uwera"
                  className={inputClass}
                />
              </FormField>

              {/* Phone (WhatsApp) */}
              <FormField label="Phone Number (WhatsApp)" icon={<Phone size={16} />}>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  placeholder="+250 7XX XXX XXX"
                  className={inputClass}
                />
              </FormField>

              {/* Date */}
              <FormField label="Date" icon={<CalendarDays size={16} />}>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                  min={today}
                  className={inputClass}
                />
              </FormField>

              {/* Time */}
              <FormField label="Time" icon={<Clock size={16} />}>
                <select
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                  required
                  className={inputClass}
                >
                  <option value="">Select a time</option>
                  {timeSlots.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </FormField>

              {/* Number of guests */}
              <FormField label="Number of Guests" icon={<Users size={16} />}>
                <select
                  name="guests"
                  value={form.guests}
                  onChange={handleChange}
                  required
                  className={inputClass}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? "person" : "people"}
                    </option>
                  ))}
                  <option value="11">More than 10 — please call us</option>
                </select>
              </FormField>

              {/* Special requests — full width */}
              <FormField
                label="Special Requests (optional)"
                icon={<MessageSquare size={16} />}
                className="sm:col-span-2"
              >
                <textarea
                  name="special_requests"
                  value={form.special_requests}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Dietary requirements, occasion, seating preference…"
                  className={clsx(inputClass, "resize-none")}
                />
              </FormField>
            </div>

            {/* Error message */}
            {status === "error" && (
              <p className="text-red-400 text-sm mt-4 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">
                {errorMsg}
              </p>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={status === "loading"}
              className={clsx(
                "mt-8 w-full py-4 rounded-xl font-semibold text-base transition-all duration-200",
                status === "loading"
                  ? "bg-accent/50 text-dark/50 cursor-wait"
                  : "bg-accent hover:bg-accent-light text-dark hover:shadow-lg hover:shadow-accent/20"
              )}
            >
              {status === "loading" ? "Submitting…" : "Confirm Reservation"}
            </button>

            <p className="text-white/30 text-xs text-center mt-4">
              For groups larger than 10 or same-day bookings, call us at{" "}
              <a href="tel:+250792560660" className="underline text-white/50">
                +250 792 560 660
              </a>
            </p>
          </form>
        )}
      </div>
    </section>
  );
}

// ── Shared input styling ─────────────────────────────────────
const inputClass =
  "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/25 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors";

// ── Form field wrapper with label and icon ───────────────────
function FormField({
  label,
  icon,
  children,
  className,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="flex items-center gap-1.5 text-white/50 text-xs font-medium uppercase tracking-widest mb-2">
        {icon}
        {label}
      </label>
      {children}
    </div>
  );
}
