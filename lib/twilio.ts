// ─────────────────────────────────────────────────────────────
// Twilio WhatsApp helpers
//   sendReservationAlert   → notifies the shop owner
//   sendCustomerConfirmation → auto-reply to the customer
//
// Required env vars (add to .env.local):
//   TWILIO_ACCOUNT_SID
//   TWILIO_AUTH_TOKEN
//   TWILIO_WHATSAPP_FROM   e.g. whatsapp:+14155238886
//   OWNER_WHATSAPP_NUMBER  e.g. whatsapp:+250792560660
// ─────────────────────────────────────────────────────────────

import twilio from "twilio";

// ── Owner notification ────────────────────────────────────────
export async function sendReservationAlert(data: {
  full_name: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  tables_reserved: number;
  special_requests?: string;
  isUpdate?: boolean;
}) {
  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID!,
    process.env.TWILIO_AUTH_TOKEN!
  );

  const header = data.isUpdate
    ? "✏️ *Updated Reservation — Kawa House*"
    : "🍵 *New Reservation — Kawa House*";

  const message = `
${header}

👤 Name: ${data.full_name}
📞 Phone: ${data.phone}
📅 Date: ${data.date}
⏰ Time: ${data.time}
👥 Guests: ${data.guests}
🪑 Tables Reserved: ${data.tables_reserved} of 10
📝 Notes: ${data.special_requests || "None"}
  `.trim();

  await client.messages.create({
    from: process.env.TWILIO_WHATSAPP_FROM!,
    to: process.env.OWNER_WHATSAPP_NUMBER!,
    body: message,
  });
}

// ── Customer auto-reply ───────────────────────────────────────
export async function sendCustomerConfirmation(data: {
  full_name: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  tables_reserved: number;
}) {
  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID!,
    process.env.TWILIO_AUTH_TOKEN!
  );

  // Normalise customer phone to whatsapp:+XXXXXXXXXXX format
  const digits = data.phone.replace(/\s+/g, "").replace(/[^\d+]/g, "");
  const normalised = digits.startsWith("+") ? digits : `+${digits}`;
  const to = `whatsapp:${normalised}`;

  const ownerNumber = (
    process.env.OWNER_WHATSAPP_NUMBER ?? "whatsapp:+250792560660"
  ).replace("whatsapp:", "");

  const message = `
✅ *Reservation Confirmed — Kawa House*

Hi ${data.full_name}, your table is booked!
📅 ${data.date} at ⏰ ${data.time}
👥 ${data.guests} guest${data.guests === 1 ? "" : "s"} — 🪑 ${data.tables_reserved} table${data.tables_reserved === 1 ? "" : "s"} reserved
📍 Find us in Huye, Southern Province, Rwanda

Need to change anything? Message us here or call ${ownerNumber}.
See you soon ☕
  `.trim();

  await client.messages.create({
    from: process.env.TWILIO_WHATSAPP_FROM!,
    to,
    body: message,
  });
}
