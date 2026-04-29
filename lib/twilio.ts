// ─────────────────────────────────────────────────────────────
// Twilio WhatsApp helper — sends a message to the shop owner
// when a new reservation is submitted.
//
// Required env vars (add to .env.local):
//   TWILIO_ACCOUNT_SID
//   TWILIO_AUTH_TOKEN
//   TWILIO_WHATSAPP_FROM   e.g. whatsapp:+14155238886
//   OWNER_WHATSAPP_NUMBER  e.g. whatsapp:+250792560660
// ─────────────────────────────────────────────────────────────

import twilio from "twilio";

export async function sendReservationAlert(data: {
  full_name: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  special_requests?: string;
}) {
  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );

  const message = `
🍵 *New Reservation — Kawa House*

👤 Name: ${data.full_name}
📞 Phone: ${data.phone}
📅 Date: ${data.date}
⏰ Time: ${data.time}
👥 Guests: ${data.guests}
📝 Notes: ${data.special_requests || "None"}
  `.trim();

  await client.messages.create({
    from: process.env.TWILIO_WHATSAPP_FROM,
    to: process.env.OWNER_WHATSAPP_NUMBER,
    body: message,
  });
}
