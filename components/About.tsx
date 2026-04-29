"use client";

// ─────────────────────────────────────────────────────────────
// About section — two-column layout
// Left:  shop photo
// Right: heading, description paragraph, three stat badges
// ─────────────────────────────────────────────────────────────

import { useEffect, useRef } from "react";
import Image from "next/image";

const stats = [
  { value: "500+", label: "Cups Daily" },
  { value: "100%", label: "Rwandan Beans" },
  { value: "Est.", label: "2024" },
];

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Trigger the fade-up animation when this section enters the viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="bg-cream py-24 sm:py-32 overflow-hidden">
      <div
        ref={sectionRef}
        className="reveal max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center"
      >

        {/* ── Left: shop photo ─────────────────────────────── */}
        <div className="relative">
          {/* Main photo */}
          <div className="relative rounded-3xl overflow-hidden aspect-[4/5] shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=700&h=875&fit=crop"
              alt="Inside Kawa House coffee shop"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          {/* Floating accent badge — decorative */}
          <div className="absolute -bottom-6 -right-4 sm:-right-8 bg-accent rounded-2xl px-6 py-4 shadow-xl">
            <p className="text-dark font-serif text-3xl font-bold leading-none">7AM</p>
            <p className="text-dark/70 text-xs mt-1">Opens daily</p>
          </div>

          {/* Decorative dot pattern behind the photo */}
          <div className="absolute -top-6 -left-6 w-32 h-32 grid grid-cols-4 gap-2 -z-10">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-brand/20" />
            ))}
          </div>
        </div>

        {/* ── Right: text content ───────────────────────────── */}
        <div className="space-y-8">
          {/* Section label */}
          <p className="text-accent text-sm font-medium tracking-widest uppercase">
            Our Story
          </p>

          {/* Heading */}
          <h2 className="text-4xl sm:text-5xl font-serif text-dark leading-tight">
            Welcome to
            <br />
            <span className="text-brand">Kawa House</span>
          </h2>

          {/* Description */}
          <p className="text-dark/70 text-lg leading-relaxed">
            Nestled in the heart of Huye, Rwanda, Kawa House was born from a
            deep love of Rwandan coffee culture. We source our beans directly
            from highland farms on the slopes of Huye Mountain — some of the
            world&apos;s finest arabica terroir — and roast them in small
            batches to honour their natural character.
          </p>

          <p className="text-dark/70 text-base leading-relaxed">
            Whether you&apos;re pulling up for your morning espresso, meeting a
            friend for a slow afternoon, or exploring specialty coffee for the
            first time, there&apos;s always a warm cup and a welcoming seat
            waiting for you here.
          </p>

          {/* ── Stat badges ──────────────────────────────────── */}
          <div className="flex flex-wrap gap-4 pt-2">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center bg-dark rounded-2xl px-6 py-5 min-w-[100px] shadow-lg"
              >
                <span className="text-accent font-serif text-3xl font-bold leading-none">
                  {stat.value}
                </span>
                <span className="text-white/60 text-xs mt-2 text-center leading-tight">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
