"use client";

// ─────────────────────────────────────────────────────────────
// Google Reviews section — horizontal auto-scrolling carousel
//
// These are PLACEHOLDER reviews for now.
//
// TO CONNECT REAL GOOGLE REVIEWS:
//   1. Get a Google Places API key from Google Cloud Console
//   2. Call the Places API: GET /maps/api/place/details/json
//      with fields=reviews&place_id=YOUR_PLACE_ID&key=API_KEY
//   3. Replace the `reviews` array below with the API response data
//   4. Consider caching the API response in Supabase or Next.js
//      ISR (revalidate: 3600) to avoid API rate limits
// ─────────────────────────────────────────────────────────────

import { useEffect, useRef } from "react";
import { Star } from "lucide-react";

// Placeholder reviews — replace with real Google Places API data
const reviews = [
  {
    id: 1,
    name: "Amina M.",
    rating: 5,
    text: "Best coffee in Huye! The pour-over with Huye Mountain beans is absolutely incredible. The atmosphere is warm and the staff are so welcoming. My new favourite spot.",
    date: "2 weeks ago",
  },
  {
    id: 2,
    name: "Jean-Pierre K.",
    rating: 5,
    text: "I travel a lot and Kawa House is easily one of the best specialty coffee shops I've visited in East Africa. The flat white is perfect — silky and balanced.",
    date: "1 month ago",
  },
  {
    id: 3,
    name: "Sarah O.",
    rating: 5,
    text: "The Kawa Signature Latte with cinnamon and cardamom is divine. I come here every morning before work. Consistent quality, every single time.",
    date: "3 weeks ago",
  },
  {
    id: 4,
    name: "David N.",
    rating: 4,
    text: "Beautiful space, great ambiance. The avocado toast and cold brew combo is my go-to. Love that they use 100% Rwandan beans — you can really taste the difference.",
    date: "1 month ago",
  },
  {
    id: 5,
    name: "Claudine U.",
    rating: 5,
    text: "I brought my team here for a morning meeting and everyone loved it. The team is professional, the space is cozy, and the coffee is exceptional. Highly recommend!",
    date: "2 months ago",
  },
  {
    id: 6,
    name: "Marco F.",
    rating: 5,
    text: "Visiting from Italy and I was impressed! That's saying something. The espresso is short, rich, and clean — no bitterness. Rwanda produces world-class coffee.",
    date: "6 weeks ago",
  },
];

// Duplicate for seamless infinite loop
const allReviews = [...reviews, ...reviews];

export default function Reviews() {
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

  return (
    <section className="bg-cream py-24 sm:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* ── Section header ────────────────────────────────── */}
        <div ref={sectionRef} className="reveal text-center mb-14">
          <p className="text-accent text-sm font-medium tracking-widest uppercase mb-4">
            What People Say
          </p>
          <h2 className="text-4xl sm:text-5xl font-serif text-dark leading-tight mb-4">
            Customer Reviews
          </h2>
          {/* Google star average — update these numbers when real reviews are connected */}
          <div className="flex items-center justify-center gap-2 text-dark/60 text-sm">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={16} className="fill-accent text-accent" />
              ))}
            </div>
            <span className="font-semibold text-dark">4.9</span>
            <span>· Based on Google Reviews</span>
          </div>
        </div>
      </div>

      {/* ── Auto-scrolling carousel (no JS scroll — pure CSS animation) */}
      <div className="relative">
        {/* Fade edges for a clean carousel look */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-cream to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-cream to-transparent z-10 pointer-events-none" />

        {/* Scrolling track — animates with CSS keyframes defined in globals.css */}
        <div className="flex gap-6 animate-scroll reviews-track px-6">
          {allReviews.map((review, i) => (
            <ReviewCard key={`${review.id}-${i}`} review={review} />
          ))}
        </div>
      </div>

      {/* ── CTA to Google Maps reviews ────────────────────────── */}
      <div className="text-center mt-10">
        {/* Replace # with your actual Google Maps reviews URL */}
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-brand hover:text-brand-light font-medium text-sm underline underline-offset-4 transition-colors"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" className="fill-current">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          See all reviews on Google
        </a>
      </div>
    </section>
  );
}

// ── Individual review card ───────────────────────────────────
function ReviewCard({ review }: { review: (typeof reviews)[0] }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-dark/5 w-80 shrink-0 flex flex-col gap-4">
      {/* Stars */}
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            size={14}
            className={
              s <= review.rating
                ? "fill-accent text-accent"
                : "text-dark/20"
            }
          />
        ))}
      </div>

      {/* Review text */}
      <p className="text-dark/70 text-sm leading-relaxed flex-1">&ldquo;{review.text}&rdquo;</p>

      {/* Footer: name + Google label */}
      <div className="flex items-center justify-between pt-2 border-t border-dark/5">
        <div>
          <p className="text-dark font-semibold text-sm">{review.name}</p>
          <p className="text-dark/40 text-xs">{review.date}</p>
        </div>
        <span className="text-xs text-dark/40 bg-dark/5 px-2 py-1 rounded-full">
          Google Review
        </span>
      </div>
    </div>
  );
}
