"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import menuData from "@/data/menu.json";
import clsx from "clsx";

// ── Types ────────────────────────────────────────────────────

type MenuItem = {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  tag?: string;
};

type SheetMenu = Record<string, MenuItem[]>;

// ── Category metadata ────────────────────────────────────────

const CATEGORY_META: Record<string, { emoji: string }> = {
  "Coffee":           { emoji: "☕" },
  "Specialty Drinks": { emoji: "🧃" },
  "Snacks & Bites":   { emoji: "🥐" },
};

function categoryMeta(key: string) {
  return CATEGORY_META[key] ?? { emoji: "🍽️" };
}

// Static fallback tags for the JSON dataset
const fallbackTags: Record<string, string> = {
  c6:  "Origin Special",
  s1:  "House Signature",
  s2:  "Plant-Based",
  sn2: "Chef's Pick",
  sn4: "Most Loved",
};

// ── Static fallback categories (from JSON) ───────────────────

const staticCategories = [
  { key: "Coffee",           items: menuData.coffee    as MenuItem[] },
  { key: "Specialty Drinks", items: menuData.specialty as MenuItem[] },
  { key: "Snacks & Bites",   items: menuData.snacks    as MenuItem[] },
];

// ── Price formatter ──────────────────────────────────────────

const formatPrice = (price: number) => `RWF ${price.toLocaleString("en-RW")}`;

// ── Component ────────────────────────────────────────────────

export default function Menu() {
  const [sheetMenu, setSheetMenu] = useState<SheetMenu | null>(null);
  const [isLive, setIsLive]       = useState(false);
  const [activeKey, setActiveKey] = useState<string>("Coffee");
  const sectionRef = useRef<HTMLDivElement>(null);

  // Intersection observer for reveal animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) entry.target.classList.add("visible"); },
      { threshold: 0.08 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Fetch live menu from Google Sheets API route
  useEffect(() => {
    fetch("/api/menu")
      .then((r) => r.json())
      .then((data) => {
        if (data.menu && Object.keys(data.menu).length > 0) {
          setSheetMenu(data.menu);
          setIsLive(true);
          // Default to first category in sheet
          setActiveKey(Object.keys(data.menu)[0]);
        }
      })
      .catch(() => {});
  }, []);

  // Build the category list from live data or fallback to JSON
  const categories = isLive && sheetMenu
    ? Object.keys(sheetMenu).map((key) => ({ key, items: sheetMenu[key] }))
    : staticCategories;

  // Items for active tab
  const activeItems: MenuItem[] = (() => {
    if (isLive && sheetMenu) return sheetMenu[activeKey] ?? [];
    const found = staticCategories.find((c) => c.key === activeKey);
    return (found?.items ?? []).map((item) => ({
      ...item,
      tag: fallbackTags[item.id],
    }));
  })();

  return (
    <section className="bg-dark py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Section header */}
        <div ref={sectionRef} className="reveal mb-16 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <p className="text-accent text-sm font-medium tracking-widest uppercase mb-4">
              What We Serve
            </p>
            <h2 className="text-4xl sm:text-5xl font-serif text-white leading-tight">
              Our Menu
            </h2>
          </div>
          {isLive && (
            <span className="inline-flex items-center gap-1.5 text-xs text-white/30 bg-white/[0.05] px-3 py-1.5 rounded-full self-start sm:self-auto">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Live from Google Sheets
            </span>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-10 lg:gap-20">

          {/* ── Mobile: horizontal pill tabs ────────────────── */}
          <div className="flex md:hidden gap-2 overflow-x-auto pb-1 -mx-4 px-4">
            {categories.map(({ key }) => (
              <button
                key={key}
                onClick={() => setActiveKey(key)}
                className={clsx(
                  "whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                  activeKey === key
                    ? "bg-accent text-dark"
                    : "bg-white/10 text-white/50 hover:text-white"
                )}
              >
                {categoryMeta(key).emoji} {key}
              </button>
            ))}
          </div>

          {/* ── Desktop: sticky sidebar ──────────────────────── */}
          <aside className="hidden md:block w-56 lg:w-64 shrink-0">
            <div className="sticky top-28">
              <p className="text-white/25 text-xs tracking-widest uppercase mb-5 px-5">
                Categories
              </p>
              <div className="flex flex-col border border-white/[0.06] rounded-2xl overflow-hidden">
                {categories.map(({ key }, i) => (
                  <button
                    key={key}
                    onClick={() => setActiveKey(key)}
                    className={clsx(
                      "flex items-center gap-4 w-full text-left px-5 py-4 transition-all duration-200",
                      i < categories.length - 1 && "border-b border-white/[0.06]",
                      activeKey === key
                        ? "bg-white/[0.06] text-white"
                        : "text-white/40 hover:text-white/70 hover:bg-white/[0.03]"
                    )}
                  >
                    <span className="text-xl leading-none">{categoryMeta(key).emoji}</span>
                    <span className="font-medium text-sm">{key}</span>
                    {activeKey === key && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-accent" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* ── Item list ────────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {activeItems.length === 0 ? (
              <p className="text-white/30 text-sm py-10 text-center">
                No items in this category yet.
              </p>
            ) : (
              activeItems.map((item, i) => (
                <MenuRow
                  key={item.id}
                  item={item}
                  isLast={i === activeItems.length - 1}
                />
              ))
            )}
          </div>

        </div>

        {/* Footer note */}
        <p className="text-white/20 text-sm mt-16 text-center">
          All prices in Rwandan Francs · Menu changes seasonally ·{" "}
          <a
            href="tel:+250792560660"
            className="text-accent/50 hover:text-accent underline transition-colors"
          >
            +250 792 560 660
          </a>
        </p>

      </div>
    </section>
  );
}

// ── Item row ─────────────────────────────────────────────────

function MenuRow({ item, isLast }: { item: MenuItem; isLast: boolean }) {
  return (
    <div
      className={clsx(
        "flex gap-5 sm:gap-7 py-7 group",
        !isLast && "border-b border-white/[0.07]"
      )}
    >
      {/* Thumbnail */}
      <div className="relative w-32 sm:w-44 h-24 sm:h-32 rounded-xl overflow-hidden shrink-0 bg-white/5">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 128px, 176px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl opacity-20">
            🍽️
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col justify-center gap-2">

        {/* Tag + Price */}
        <div className="flex items-center justify-between gap-3">
          {item.tag ? (
            <span className="text-xs bg-accent/15 text-accent px-3 py-0.5 rounded-full font-medium tracking-wide">
              {item.tag}
            </span>
          ) : (
            <span />
          )}
          <span className="text-white font-semibold text-base sm:text-lg shrink-0">
            {formatPrice(item.price)}
          </span>
        </div>

        {/* Name */}
        <h3 className="font-serif text-xl sm:text-2xl text-accent leading-snug">
          {item.name}
        </h3>

        {/* Description */}
        <p className="text-white/40 text-sm leading-relaxed line-clamp-2">
          {item.description}
        </p>

      </div>
    </div>
  );
}
