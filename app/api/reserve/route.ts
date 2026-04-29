// ─────────────────────────────────────────────────────────────
// API Route: POST /api/reserve
//
// This runs on the server (not in the browser) so it's safe
// to use secret API keys here.
//
// What it does:
//   1. Receives reservation form data from the front end
//   2. Validates the required fields
//   3. Saves the reservation to Supabase (database)
//   4. Sends a WhatsApp alert to the shop owner via Twilio
//   5. Returns a success or error response
// ─────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendReservationAlert } from "@/lib/twilio";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { full_name, phone, date, time, guests, special_requests } = body;

    // ── Validate required fields ────────────────────────────
    if (!full_name || !phone || !date || !time || !guests) {
      return NextResponse.json(
        { error: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    // ── Save to Supabase ────────────────────────────────────
    // The 'reservations' table must exist in your Supabase project.
    // See README.md for the table schema to create it.
    const { error: dbError } = await supabase.from("reservations").insert([
      {
        full_name,
        phone,
        date,
        time,
        guests: Number(guests),
        special_requests: special_requests || null,
      },
    ]);

    if (dbError) {
      console.error("Supabase error:", dbError);
      return NextResponse.json(
        { error: "Failed to save reservation. Please try again." },
        { status: 500 }
      );
    }

    // ── Send WhatsApp alert to owner ────────────────────────
    // This uses Twilio. If Twilio env vars are not set, it skips
    // silently so the reservation still saves to the database.
    if (
      process.env.TWILIO_ACCOUNT_SID &&
      process.env.TWILIO_AUTH_TOKEN &&
      process.env.OWNER_WHATSAPP_NUMBER
    ) {
      try {
        await sendReservationAlert({
          full_name,
          phone,
          date,
          time,
          guests: Number(guests),
          special_requests,
        });
      } catch (twilioError) {
        // Log the error but don't fail the whole request —
        // the reservation is already saved in the database.
        console.error("Twilio error (non-fatal):", twilioError);
      }
    }

    return NextResponse.json(
      { message: "Reservation confirmed! See you at Kawa House." },
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
