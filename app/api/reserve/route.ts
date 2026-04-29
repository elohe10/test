// ─────────────────────────────────────────────────────────────
// API Route: /api/reserve
//
// POST — create a new reservation
//   1. Validate fields
//   2. Duplicate detection (same phone, last 24 h) — skipped if force=true
//   3. Table availability check for the 1-hour slot
//   4. Insert to Supabase
//   5. Notify owner + send customer confirmation via WhatsApp
//
// PUT — edit an existing reservation
//   1. Validate fields + id
//   2. Enforce 60-minute edit window
//   3. Table availability check (excluding this reservation)
//   4. Update in Supabase
//   5. Notify owner of the change
// ─────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendReservationAlert, sendCustomerConfirmation } from "@/lib/twilio";

const TOTAL_TABLES = 10;
const GUESTS_PER_TABLE = 4;
const EDIT_WINDOW_MINUTES = 60;

function tablesFor(guests: number) {
  return Math.ceil(guests / GUESTS_PER_TABLE);
}

// Returns the start/end TIME strings for the 1-hour slot containing `time`
function hourSlotBounds(time: string): { start: string; end: string | null } {
  const hour = parseInt(time.split(":")[0], 10);
  const start = `${String(hour).padStart(2, "0")}:00:00`;
  const end =
    hour < 23 ? `${String(hour + 1).padStart(2, "0")}:00:00` : null;
  return { start, end };
}

// Sum tables_reserved for a slot, optionally excluding one reservation id
async function bookedTablesForSlot(
  date: string,
  time: string,
  excludeId?: number
): Promise<number> {
  const { start, end } = hourSlotBounds(time);

  let q = supabase
    .from("reservations")
    .select("tables_reserved")
    .eq("date", date)
    .eq("status", "confirmed")
    .gte("time", start);

  if (end) q = q.lt("time", end);
  if (excludeId) q = q.neq("id", excludeId);

  const { data } = await q;
  return (data ?? []).reduce((sum, r) => sum + (r.tables_reserved ?? 0), 0);
}

// ── POST — create ─────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { full_name, phone, date, time, guests, special_requests, force } =
      body;

    if (!full_name || !phone || !date || !time || !guests) {
      return NextResponse.json(
        { error: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    const guestCount = Number(guests);
    const tablesNeeded = tablesFor(guestCount);

    // ── Rule 1: Duplicate detection ───────────────────────────
    if (!force) {
      const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

      const { data: existing } = await supabase
        .from("reservations")
        .select("id, date, time, guests, full_name, phone, special_requests, created_at")
        .eq("phone", phone)
        .eq("status", "confirmed")
        .gte("created_at", cutoff)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (existing) {
        return NextResponse.json(
          { duplicate: true, existing },
          { status: 409 }
        );
      }
    }

    // ── Rule 4: Table availability ────────────────────────────
    const booked = await bookedTablesForSlot(date, time);
    const available = TOTAL_TABLES - booked;

    if (tablesNeeded > available) {
      return NextResponse.json(
        {
          error: `Sorry, we don't have enough tables available for ${guestCount} guests at ${time} on ${date}. We have ${available} table${available === 1 ? "" : "s"} left for that slot. Try a different time or reduce your group size.`,
        },
        { status: 409 }
      );
    }

    // ── Save to Supabase ──────────────────────────────────────
    const { data: saved, error: dbError } = await supabase
      .from("reservations")
      .insert([
        {
          full_name,
          phone,
          date,
          time,
          guests: guestCount,
          special_requests: special_requests || null,
          status: "confirmed",
          tables_reserved: tablesNeeded,
        },
      ])
      .select()
      .single();

    if (dbError) {
      console.error("Supabase insert error:", dbError);
      return NextResponse.json(
        { error: "Failed to save reservation. Please try again." },
        { status: 500 }
      );
    }

    // ── WhatsApp notifications (non-fatal) ────────────────────
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      try {
        await sendReservationAlert({
          full_name, phone, date, time,
          guests: guestCount,
          tables_reserved: tablesNeeded,
          special_requests,
        });
      } catch (e) {
        console.error("Owner WhatsApp error:", e);
      }

      try {
        await sendCustomerConfirmation({
          full_name, phone, date, time,
          guests: guestCount,
          tables_reserved: tablesNeeded,
        });
      } catch (e) {
        console.error("Customer WhatsApp error:", e);
      }
    }

    return NextResponse.json(
      { message: "Reservation confirmed! See you at Kawa House.", id: saved.id },
      { status: 200 }
    );
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

// ── PUT — edit ────────────────────────────────────────────────
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, full_name, phone, date, time, guests, special_requests } = body;

    if (!id || !full_name || !phone || !date || !time || !guests) {
      return NextResponse.json(
        { error: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    // ── Rule 2: 60-minute edit window ─────────────────────────
    const { data: existing, error: fetchError } = await supabase
      .from("reservations")
      .select("created_at")
      .eq("id", id)
      .maybeSingle();

    if (fetchError || !existing) {
      return NextResponse.json(
        { error: "Reservation not found." },
        { status: 404 }
      );
    }

    const minutesSince =
      (Date.now() - new Date(existing.created_at).getTime()) / 60_000;

    if (minutesSince > EDIT_WINDOW_MINUTES) {
      const ownerNumber = (
        process.env.OWNER_WHATSAPP_NUMBER ?? "whatsapp:+250792560660"
      ).replace("whatsapp:", "");
      return NextResponse.json(
        {
          error: `Sorry, reservations can only be edited within 60 minutes of booking. Please call us or message us on WhatsApp to make changes: ${ownerNumber}`,
        },
        { status: 403 }
      );
    }

    const guestCount = Number(guests);
    const tablesNeeded = tablesFor(guestCount);

    // ── Table availability (excluding this reservation) ───────
    const booked = await bookedTablesForSlot(date, time, Number(id));
    const available = TOTAL_TABLES - booked;

    if (tablesNeeded > available) {
      return NextResponse.json(
        {
          error: `Sorry, we don't have enough tables available for ${guestCount} guests at ${time} on ${date}. We have ${available} table${available === 1 ? "" : "s"} left for that slot. Try a different time or reduce your group size.`,
        },
        { status: 409 }
      );
    }

    // ── Update in Supabase ────────────────────────────────────
    const { error: updateError } = await supabase
      .from("reservations")
      .update({
        full_name,
        phone,
        date,
        time,
        guests: guestCount,
        special_requests: special_requests || null,
        tables_reserved: tablesNeeded,
      })
      .eq("id", id);

    if (updateError) {
      console.error("Supabase update error:", updateError);
      return NextResponse.json(
        { error: "Failed to update reservation. Please try again." },
        { status: 500 }
      );
    }

    // ── Notify owner of the change (non-fatal) ────────────────
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      try {
        await sendReservationAlert({
          full_name, phone, date, time,
          guests: guestCount,
          tables_reserved: tablesNeeded,
          special_requests,
          isUpdate: true,
        });
      } catch (e) {
        console.error("Owner WhatsApp error:", e);
      }
    }

    return NextResponse.json(
      { message: "Reservation updated! See you at Kawa House." },
      { status: 200 }
    );
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
