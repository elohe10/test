"use client";

// ─────────────────────────────────────────────────────────────
// Reservation section — smart booking form
//
// Features:
//  - Duplicate detection: warns if same phone booked in last 24 h
//  - Edit mode: pre-fills form and sends PUT; locked after 60 min
//  - Real-time table count: shows tables needed for 5+ guests
//  - Table availability: API rejects if slot is fully booked
//  - Success confirmation with booking summary
// ─────────────────────────────────────────────────────────────

import { useState, useEffect, useRef } from "react";
import {
  CalendarDays,
  Clock,
  Users,
  Phone,
  User,
  MessageSquare,
  CheckCircle,
} from "lucide-react";
import clsx from "clsx";

// ── Types ─────────────────────────────────────────────────────

type FormData = {
  full_name: string;
  phone: string;
  date: string;
  time: string;
  guests: string;
  special_requests: string;
};

type DuplicateData = {
  id: number;
  date: string;
  time: string;
  guests: number;
  full_name: string;
  phone: string;
  special_requests?: string | null;
  created_at: string;
};

type Status = "idle" | "loading" | "success" | "error";

// ── Constants ─────────────────────────────────────────────────

const GUESTS_PER_TABLE = 4;
const EDIT_WINDOW_MINUTES = 60;

const initialForm: FormData = {
  full_name: "",
  phone: "",
  date: "",
  time: "",
  guests: "2",
  special_requests: "",
};

const timeSlots = [
  "07:00", "07:30", "08:00", "08:30", "09:00", "09:30",
  "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30", "18:00", "18:30",
  "19:00", "19:30", "20:00", "20:30",
];

// ── Component ─────────────────────────────────────────────────

export default function Reservation() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [duplicateData, setDuplicateData] = useState<DuplicateData | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const sectionRef = useRef<HTMLDivElement>(null);

  // Scroll-in animation
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

  // ── Computed values ─────────────────────────────────────────

  const guestCount = Number(form.guests);
  const tablesNeeded = Math.ceil(guestCount / GUESTS_PER_TABLE);
  const showTableInfo = guestCount >= 5;

  // How many minutes remain in the edit window (for the banner)
  const editMinutesLeft = editingId && duplicateData === null
    ? (() => {
        // We don't have created_at after switching to edit mode, so just show 60 min
        return EDIT_WINDOW_MINUTES;
      })()
    : null;

  // ── Handlers ───────────────────────────────────────────────

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Core submit — used by the form and the "Make Another" button
  const submitReservation = async (force: boolean) => {
    setStatus("loading");
    setErrorMsg("");

    const isEditing = editingId !== null;
    const method = isEditing ? "PUT" : "POST";
    const payload = isEditing
      ? { ...form, id: editingId, guests: guestCount }
      : { ...form, guests: guestCount, force };

    try {
      const res = await fetch("/api/reserve", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      // Duplicate found — show the duplicate UI
      if (res.status === 409 && data.duplicate) {
        setDuplicateData(data.existing);
        setStatus("idle");
        return;
      }

      if (!res.ok) {
        setErrorMsg(data.error || "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setSuccessMessage(isEditing ? "Reservation updated!" : "You're booked!");
      setStatus("success");
      setForm(initialForm);
      setEditingId(null);
    } catch {
      setErrorMsg("Network error. Please check your connection and try again.");
      setStatus("error");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitReservation(false);
  };

  // User clicked "Edit My Reservation" on the duplicate screen
  const handleEditExisting = () => {
    if (!duplicateData) return;

    // Client-side 60-minute window pre-check
    const minutesSince =
      (Date.now() - new Date(duplicateData.created_at).getTime()) / 60_000;

    if (minutesSince > EDIT_WINDOW_MINUTES) {
      const ownerNumber = "+250 792 560 660";
      setErrorMsg(
        `Sorry, reservations can only be edited within 60 minutes of booking. Please call us or message us on WhatsApp to make changes: ${ownerNumber}`
      );
      setStatus("error");
      setDuplicateData(null);
      return;
    }

    // Pre-fill the form with the existing reservation
    setForm({
      full_name: duplicateData.full_name,
      phone: duplicateData.phone,
      date: duplicateData.date,
      time: duplicateData.time.slice(0, 5), // strip seconds if present
      guests: String(duplicateData.guests),
      special_requests: duplicateData.special_requests ?? "",
    });
    setEditingId(duplicateData.id);
    setDuplicateData(null);
  };

  // User clicked "Make Another Reservation" on the duplicate screen
  const handleForceNew = () => {
    setDuplicateData(null);
    submitReservation(true);
  };

  const today = new Date().toISOString().split("T")[0];

  // ── Render ──────────────────────────────────────────────────

  return (
    <section id="reserve" className="bg-dark py-24 sm:py-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Section header */}
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

        {/* ── Success state ──────────────────────────────────── */}
        {status === "success" ? (
          <div className="max-w-md mx-auto text-center py-16">
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-green-400" />
            </div>
            <h3 className="text-white font-serif text-3xl mb-3">
              {successMessage}
            </h3>
            <p className="text-white/60 text-base mb-8">
              {editingId !== null
                ? "Your reservation has been updated. Check your WhatsApp for the new details."
                : "Your table is confirmed. Check your WhatsApp for a confirmation message."}
            </p>
            <button
              onClick={() => { setStatus("idle"); setSuccessMessage(""); }}
              className="text-accent underline underline-offset-4 text-sm hover:text-accent-light transition-colors"
            >
              Make another reservation
            </button>
          </div>

        /* ── Duplicate found state ─────────────────────────── */
        ) : duplicateData ? (
          <div className="max-w-md mx-auto text-center py-8">
            <div className="text-4xl mb-5">👀</div>
            <h3 className="text-white font-serif text-2xl mb-2">
              You already have a reservation today
            </h3>
            <p className="text-white/50 text-sm mb-6">
              Would you like to edit this reservation or make a new one?
            </p>

            {/* Existing reservation summary */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-left space-y-2 mb-8">
              <p className="text-white/70 text-sm">
                📅 <span className="text-white font-medium">{duplicateData.date}</span>
                &nbsp;&nbsp;⏰ <span className="text-white font-medium">{duplicateData.time.slice(0, 5)}</span>
              </p>
              <p className="text-white/70 text-sm">
                👥 <span className="text-white font-medium">{duplicateData.guests}</span>{" "}
                guest{duplicateData.guests === 1 ? "" : "s"}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleEditExisting}
                className="flex-1 py-3.5 rounded-xl bg-accent hover:bg-accent-light text-dark font-semibold text-sm transition-all"
              >
                ✏️ Edit My Reservation
              </button>
              <button
                onClick={handleForceNew}
                disabled={status === "loading"}
                className="flex-1 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm transition-all disabled:opacity-50"
              >
                {status === "loading" ? "Submitting…" : "+ Make Another Reservation"}
              </button>
            </div>
          </div>

        /* ── Form (new or edit mode) ───────────────────────── */
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-dark-card rounded-3xl border border-white/10 p-6 sm:p-10 max-w-3xl mx-auto"
          >
            {/* Edit mode banner */}
            {editingId && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 mb-6">
                <p className="text-amber-400 text-sm">
                  ✏️ You are editing your existing reservation. Changes must be
                  made within {EDIT_WINDOW_MINUTES} minutes of your original booking.
                </p>
              </div>
            )}

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

              {/* Phone */}
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
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </FormField>

              {/* Guests */}
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

              {/* Real-time table info for groups of 5+ */}
              {showTableInfo && (
                <div className="sm:col-span-2 space-y-2 -mt-1">
                  <p className="text-accent text-xs font-medium">
                    🪑 Your group will need {tablesNeeded} tables. Each table seats up to {GUESTS_PER_TABLE} guests.
                  </p>
                  <p className="text-white/40 text-xs">
                    For groups larger than {GUESTS_PER_TABLE}, your party will be split across multiple tables.
                    Submit one reservation for your full group and we will arrange the tables for you.
                  </p>
                </div>
              )}

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

            {/* Submit / Cancel edit */}
            <div className={clsx("mt-8", editingId && "flex gap-3")}>
              {editingId && (
                <button
                  type="button"
                  onClick={() => { setEditingId(null); setForm(initialForm); setStatus("idle"); }}
                  className="flex-1 py-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-base transition-all"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={status === "loading"}
                className={clsx(
                  "py-4 rounded-xl font-semibold text-base transition-all duration-200",
                  editingId ? "flex-1" : "w-full",
                  status === "loading"
                    ? "bg-accent/50 text-dark/50 cursor-wait"
                    : "bg-accent hover:bg-accent-light text-dark hover:shadow-lg hover:shadow-accent/20"
                )}
              >
                {status === "loading"
                  ? "Submitting…"
                  : editingId
                  ? "Save Changes"
                  : "Confirm Reservation"}
              </button>
            </div>

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

// ── Form field wrapper ───────────────────────────────────────
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
