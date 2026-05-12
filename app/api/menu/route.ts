import { NextResponse } from "next/server";

// 5-minute ISR cache — sheet changes appear on site within 5 minutes
export const revalidate = 300;

type SheetItem = {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  tag?: string;
};

export async function GET() {
  const apiKey = process.env.GOOGLE_SHEETS_API_KEY;
  const sheetId = process.env.GOOGLE_SHEET_ID;

  if (!apiKey || !sheetId) {
    return NextResponse.json({ menu: null });
  }

  const range = "Menu!A5:G"; // tab is named "Menu"; headers are row 4, data starts row 5
  const url =
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}` +
    `?key=${apiKey}`;

  let res: Response;
  try {
    res = await fetch(url, { next: { revalidate: 300 } });
  } catch (err) {
    console.error("Sheets API fetch error:", err);
    return NextResponse.json({ menu: null });
  }

  const data = await res.json();

  if (!res.ok || !data.values || data.values.length === 0) {
    if (!res.ok) console.error("Sheets API error:", data.error?.message);
    return NextResponse.json({ menu: null });
  }

  const menu: Record<string, SheetItem[]> = {};

  (data.values as string[][]).forEach((row, i) => {
    const [category, name, priceRaw, description, image, available, tag] = row;

    // Skip rows with no name or explicitly marked unavailable
    if (!name?.trim()) return;
    if (available?.trim().toLowerCase() === "no") return;

    const price = parseInt((priceRaw ?? "").replace(/[^0-9]/g, ""), 10) || 0;
    const key = category?.trim() || "Other";

    if (!menu[key]) menu[key] = [];
    menu[key].push({
      id: `sheet-${i}`,
      name: name.trim(),
      price,
      description: description?.trim() ?? "",
      image: image?.trim() ?? "",
      tag: tag?.trim() || undefined,
    });
  });

  return NextResponse.json({ menu });
}
