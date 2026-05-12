import { NextResponse } from "next/server";

// Cache the response for 1 hour — avoids hammering the Places API
export const revalidate = 3600;

export async function GET() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  // If env vars aren't set yet, return empty so the UI falls back to placeholders
  if (!apiKey || !placeId) {
    return NextResponse.json({ reviews: [], rating: null, total: 0 });
  }

  const url =
    `https://maps.googleapis.com/maps/api/place/details/json` +
    `?place_id=${placeId}&fields=reviews,rating,user_ratings_total&key=${apiKey}`;

  const res = await fetch(url, { next: { revalidate: 3600 } });
  const data = await res.json();

  if (data.status !== "OK") {
    console.error("Google Places API error:", data.status, data.error_message);
    return NextResponse.json({ reviews: [], rating: null, total: 0 });
  }

  const reviews = (data.result.reviews ?? []).map((r: {
    author_name: string;
    rating: number;
    text: string;
    relative_time_description: string;
    profile_photo_url?: string;
  }) => ({
    name: r.author_name,
    rating: r.rating,
    text: r.text,
    date: r.relative_time_description,
    photo: r.profile_photo_url ?? null,
  }));

  return NextResponse.json({
    reviews,
    rating: data.result.rating ?? null,
    total: data.result.user_ratings_total ?? 0,
  });
}
