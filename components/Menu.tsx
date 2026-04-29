"use client";

// ─────────────────────────────────────────────────────────────
// Menu section — tabbed grid of menu items
// Tabs: Coffee | Specialty Drinks | Snacks & Bites
//
// Menu data lives in data/menu.json — easy to update without
// touching this component. Just edit the JSON file.
// ─────────────────────────────────────────────────────────────

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import menuData from "@/data/menu.json";
import clsx from "clsx";

// Tab definitions — label shown and which key to use from menu.json
const tabs = [
  { id: "coffee", label: "Coffee" },
  { id: "specialty", label: "Specialty Drinks" },
  { id: "snacks", label: "Snacks & Bites" },
] as const;

type TabId = (typeof tabs)[number]["id"];

// Type for a single menu item
type MenuItem = {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
};

// Price formatter — shows RWF with comma separators
const formatPrice = (price: number) =>
  `RWF ${price.toLocaleString("en-RW")}`;

export default function Menu() {
  const [activeTab, setActiveTab] = useState<TabId>("coffee");
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

  // Get the items for the currently selected tab
  const items: MenuItem[] =
    activeTab === "coffee"
      ? menuData.coffee
      : activeTab === "specialty"
      ? menuData.specialty
      : menuData.snacks;

  return (
    <section className="bg-cream-dark py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* ── Section header ────────────────────────────────── */}
        <div ref={sectionRef} className="reveal text-center mb-12">
          <p className="text-accent text-sm font-medium tracking-widest uppercase mb-4">
            What We Serve
          </p>
          <h2 className="text-4xl sm:text-5xl font-serif text-dark leading-tight mb-4">
            Our Menu
          </h2>
          <p className="text-dark/60 text-base max-w-md mx-auto">
            All prices are in Rwandan Francs (RWF). Menu changes seasonally.
          </p>
        </div>

        {/* ── Tab switcher ──────────────────────────────────── */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-dark/10 rounded-full p-1 gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={clsx(
                  "px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200",
                  activeTab === tab.id
                    ? "bg-dark text-white shadow-md"
                    : "text-dark/60 hover:text-dark"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Menu grid ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 reveal-stagger visible">
          {items.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>

        {/* ── Full menu note ────────────────────────────────── */}
        <p className="text-center text-dark/40 text-sm mt-10">
          See something you like? Come in and we&apos;ll make it for you.
          Call us at{" "}
          <a href="tel:+250792560660" className="text-brand underline">
            +250 792 560 660
          </a>
        </p>
      </div>
    </section>
  );
}

// ── Individual menu card component ──────────────────────────
function MenuCard({ item }: { item: MenuItem }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
      {/* Card image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>

      {/* Card content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="text-dark font-serif text-lg leading-tight font-medium">
            {item.name}
          </h3>
          <span className="text-brand font-semibold text-sm whitespace-nowrap bg-brand/10 px-2.5 py-1 rounded-full">
            {formatPrice(item.price)}
          </span>
        </div>
        <p className="text-dark/60 text-sm leading-relaxed">{item.description}</p>
      </div>
    </div>
  );
}
