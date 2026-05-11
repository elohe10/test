import twilio from "twilio";

const DIVIDER = "━━━━━━━━━━━━━━━";
const MAPS_LINK = "https://maps.google.com/?q=Kawa+House,Huye,Rwanda";

// ── Formatting helpers ────────────────────────────────────────

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const d = new Date(year, month - 1, day);
  const dayName = d.toLocaleDateString("en-GB", { weekday: "long" });
  const monthName = d.toLocaleDateString("en-GB", { month: "long" });
  return `${dayName}, ${day} ${monthName} ${year}`;
}

function formatTime(timeStr: string): string {
  const [h, m] = timeStr.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${period}`;
}

function relativeDay(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const res = new Date(year, month - 1, day);
  res.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.round((res.getTime() - today.getTime()) / 86_400_000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  const name = res.toLocaleDateString("en-GB", { weekday: "long" });
  return diff <= 6 ? `This ${name}` : name;
}

function firstName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length >= 2 && parts[1].length > 1) return `${parts[0]} ${parts[1]}`;
  return parts[0];
}

// Converts any common Rwandan phone format to E.164 (+250XXXXXXXXX)
function normalizePhone(phone: string): string {
  const cleaned = phone.replace(/\s+/g, "").replace(/[^\d+]/g, "");
  if (cleaned.startsWith("+")) return cleaned;
  if (cleaned.startsWith("0")) return "+250" + cleaned.slice(1);
  return "+" + cleaned;
}

function waLink(phone: string): string {
  return "https://wa.me/" + normalizePhone(phone).replace("+", "");
}

// ── Owner notification ────────────────────────────────────────

export async function sendReservationAlert(data: {
  full_name: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  tables_reserved: number;
  tablesStillFree: number;
  special_requests?: string;
  isUpdate?: boolean;
}) {
  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID!,
    process.env.TWILIO_AUTH_TOKEN!
  );

  const header = data.isUpdate ? "✏️ *Updated Reservation*" : "☕ *New Table Reservation*";
  const notes = data.special_requests?.trim()
    ? `"${data.special_requests.trim()}"`
    : "No special notes";

  const message = [
    header,
    DIVIDER,
    "🏪 *Kawa House — Huye*",
    "",
    `👤 *${data.full_name}*`,
    `📞 ${waLink(data.phone)}`,
    DIVIDER,
    `📅 ${formatDate(data.date)}`,
    `⏰ ${formatTime(data.time)} — *${relativeDay(data.date)}*`,
    `👥 ${data.guests} guest${data.guests === 1 ? "" : "s"} → 🪑 ${data.tables_reserved} table${data.tables_reserved === 1 ? "" : "s"} needed`,
    DIVIDER,
    "📝 *Guest Note:*",
    notes,
    DIVIDER,
    `📊 Availability: ${data.tablesStillFree} table${data.tablesStillFree === 1 ? "" : "s"} still free`,
  ].join("\n");

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

  const to = `whatsapp:${normalizePhone(data.phone)}`;
  const ownerNumber = (
    process.env.OWNER_WHATSAPP_NUMBER ?? "whatsapp:+250792560660"
  ).replace("whatsapp:", "");

  const name = firstName(data.full_name);

  const [year, month, day] = data.date.split("-").map(Number);
  const d = new Date(year, month - 1, day);
  const dayName = d.toLocaleDateString("en-GB", { weekday: "long" });
  const monthName = d.toLocaleDateString("en-GB", { month: "long" });
  const v = day % 100;
  const suffix = (["th","st","nd","rd"])[(v - 20) % 10] ?? (["th","st","nd","rd"])[v] ?? "th";
  const formattedDate = `${dayName}, ${monthName} ${day}${suffix}`;

  const tables = data.tables_reserved;
  const guests = data.guests;

  const message = [
    `Hey ${name}! 👋 Your table at Kawa House is confirmed for ${formattedDate} at ${formatTime(data.time)}: ${guests} guest${guests === 1 ? "" : "s"} you will be on ${tables} table${tables === 1 ? "" : "s"}. We open at 7 AM so feel free to come early.`,
    `When you arrive, just scan the QR menu at your table to order. If anything changes, reply here or call us on ${ownerNumber}.`,
    `See you soon ☕`,
    `Kawa House`,
  ].join("\n");

  await client.messages.create({
    from: process.env.TWILIO_WHATSAPP_FROM!,
    to,
    body: message,
  });
}
