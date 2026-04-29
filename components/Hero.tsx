"use client";

// ─────────────────────────────────────────────────────────────
// Hero section — the first thing visitors see
// - Full-screen background photo with dark overlay
// - Large headline and subheadline
// - "Explore Menu" call-to-action button
// - Floating row of drink thumbnails (like the Mood template)
// ─────────────────────────────────────────────────────────────

import Image from "next/image";

// Floating drink thumbnail images — replace with real photos when ready
const drinkThumbnails = [
  {
    id: 1,
    name: "Espresso",
    image: "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=120&h=120&fit=crop",
  },
  {
    id: 2,
    name: "Latte",
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=120&h=120&fit=crop",
  },
  {
    id: 3,
    name: "Cold Brew",
    image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=120&h=120&fit=crop",
  },
  {
    id: 4,
    name: "Cappuccino",
    image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=120&h=120&fit=crop",
  },
  {
    id: 5,
    name: "Pour Over",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=120&h=120&fit=crop",
  },
];

export default function Hero() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">

      {/* ── Background photo with warm dark overlay ─────────── */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1920&h=1080&fit=crop"
          alt="Kawa House coffee shop interior"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {/* Warm dark gradient overlay — adjust opacity here to make it lighter or darker */}
        <div className="absolute inset-0 bg-gradient-to-b from-dark/75 via-dark/60 to-dark/85" />
        {/* Warm amber tint at the bottom to blend into the floating bar */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-dark to-transparent" />
      </div>

      {/* ── Hero content ─────────────────────────────────────── */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto pt-24 pb-48">

        {/* Small label above the headline */}
        <p className="text-accent text-sm sm:text-base font-medium tracking-widest uppercase mb-6 animate-fade-in">
          Specialty Coffee · Huye, Rwanda
        </p>

        {/* Main headline */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif text-white leading-tight mb-6 animate-fade-up">
          Where Every Cup
          <br />
          <span className="text-accent italic">Tells a Story</span>
        </h1>

        {/* Subheadline */}
        <p
          className="text-white/70 text-lg sm:text-xl max-w-xl mx-auto mb-10 animate-fade-up"
          style={{ animationDelay: "0.15s" }}
        >
          Sourced from Rwanda&apos;s finest highland farms. Roasted with care.
          Served with warmth.
        </p>

        {/* Call-to-action button */}
        <div
          className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up"
          style={{ animationDelay: "0.25s" }}
        >
          <a
            href="#menu"
            className="inline-block bg-accent hover:bg-accent-light text-dark font-semibold px-8 py-4 rounded-full text-base transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-accent/30"
          >
            Explore Menu
          </a>
          <a
            href="#reserve"
            className="inline-block border border-white/40 hover:border-accent text-white hover:text-accent font-medium px-8 py-4 rounded-full text-base transition-all duration-200"
          >
            Reserve a Table
          </a>
        </div>
      </div>

      {/* ── Floating drink thumbnails row ────────────────────── */}
      {/* Positioned at the bottom of the hero, floating over the transition */}
      <div
        className="absolute bottom-0 left-0 right-0 z-20 animate-fade-up"
        style={{ animationDelay: "0.4s" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-0">
          <div className="bg-dark/80 backdrop-blur-md border border-white/10 rounded-t-3xl px-6 py-5">
            <div className="flex items-center justify-between gap-3 overflow-x-auto scrollbar-hide">

              {/* Left label */}
              <div className="shrink-0 hidden sm:block">
                <p className="text-white/40 text-xs uppercase tracking-widest">Popular</p>
                <p className="text-white text-sm font-medium">Drinks</p>
              </div>

              {/* Divider */}
              <div className="hidden sm:block w-px h-12 bg-white/10 shrink-0" />

              {/* Drink thumbnails */}
              <div className="flex items-center gap-4 flex-1 justify-center">
                {drinkThumbnails.map((drink) => (
                  <a
                    key={drink.id}
                    href="#menu"
                    className="flex flex-col items-center gap-2 group shrink-0"
                  >
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border-2 border-white/10 group-hover:border-accent transition-all duration-200 group-hover:scale-105">
                      <Image
                        src={drink.image}
                        alt={drink.name}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <span className="text-white/60 text-xs group-hover:text-accent transition-colors">
                      {drink.name}
                    </span>
                  </a>
                ))}
              </div>

              {/* Divider */}
              <div className="hidden sm:block w-px h-12 bg-white/10 shrink-0" />

              {/* Right: Opening hours */}
              <div className="shrink-0 hidden sm:block text-right">
                <p className="text-white/40 text-xs uppercase tracking-widest">Open</p>
                <p className="text-white text-sm font-medium">7AM – 9PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
