"use client";

// ─────────────────────────────────────────────────────────────
// Our Process section — three numbered steps
// Shows how the coffee goes from farm to cup.
// Layout: large number, step title, description
// ─────────────────────────────────────────────────────────────

import { useEffect, useRef } from "react";
import Image from "next/image";

const steps = [
  {
    number: "01",
    title: "Sourcing Rwandan Beans",
    description:
      "We partner directly with small-hold farmers on the Huye Mountain slopes, selecting only the top-grade arabica cherries harvested at peak ripeness. Traceable, ethical, and exceptional.",
    image: "https://images.unsplash.com/photo-1497515114629-f71d768fd07c?w=500&h=350&fit=crop",
  },
  {
    number: "02",
    title: "Expert Roasting & Brewing",
    description:
      "Our roast-master profiles each harvest individually — light roasts to highlight the citrus and berry notes unique to Rwandan coffee, medium roasts for the classic chocolatey body.",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&h=350&fit=crop",
  },
  {
    number: "03",
    title: "Served With Care",
    description:
      "Every cup is prepared to order by our trained baristas. From a precise pour-over to a perfectly textured flat white — the final moment matters as much as the first.",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&h=350&fit=crop",
  },
];

export default function Process() {
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
    <section className="bg-dark py-24 sm:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* ── Section header ────────────────────────────────── */}
        <div className="text-center mb-16 reveal" ref={sectionRef}>
          <p className="text-accent text-sm font-medium tracking-widest uppercase mb-4">
            From Farm to Cup
          </p>
          <h2 className="text-4xl sm:text-5xl font-serif text-white leading-tight">
            Our Process
          </h2>
        </div>

        {/* ── Steps ─────────────────────────────────────────── */}
        <div className="space-y-16 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-10">
          {steps.map((step, index) => (
            <ProcessStep key={step.number} step={step} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Individual step card ─────────────────────────────────────
function ProcessStep({
  step,
  index,
}: {
  step: (typeof steps)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) entry.target.classList.add("visible");
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="reveal group"
      style={{ transitionDelay: `${index * 0.15}s` }}
    >
      {/* Step photo */}
      <div className="relative rounded-2xl overflow-hidden aspect-video mb-8">
        <Image
          src={step.image}
          alt={step.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 1024px) 100vw, 33vw"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-dark/30" />

        {/* Step number — large, overlaid on photo */}
        <div className="absolute top-4 left-4">
          <span className="text-7xl font-serif font-bold text-white/20 leading-none">
            {step.number}
          </span>
        </div>
      </div>

      {/* Step text */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="text-accent text-sm font-mono font-bold">{step.number}</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>
        <h3 className="text-white font-serif text-2xl">{step.title}</h3>
        <p className="text-white/60 text-base leading-relaxed">{step.description}</p>
      </div>
    </div>
  );
}
