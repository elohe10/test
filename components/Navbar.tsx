"use client";

// ─────────────────────────────────────────────────────────────
// Navbar — sticky top navigation bar
// - Logo on the left
// - Navigation links on the right (desktop)
// - Hamburger menu on mobile
// - Background darkens after scrolling 50px
// ─────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import clsx from "clsx";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Menu", href: "#menu" },
  { label: "About", href: "#about" },
  { label: "Reviews", href: "#reviews" },
  { label: "Reserve a Table", href: "#reserve", highlight: true },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Change navbar background when user scrolls down
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when a link is clicked
  const handleLinkClick = () => setMenuOpen(false);

  return (
    <nav
      className={clsx(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-dark/95 backdrop-blur-sm shadow-lg py-3"
          : "bg-transparent py-5"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">

        {/* ── Logo ─────────────────────────────────────────── */}
        <a href="#home" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center">
            <span className="text-dark font-serif font-bold text-sm">K</span>
          </div>
          <span className="text-white font-serif text-xl font-semibold tracking-wide group-hover:text-accent transition-colors">
            Kawa House
          </span>
        </a>

        {/* ── Desktop links ─────────────────────────────────── */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={clsx(
                  "text-sm font-medium transition-colors duration-200",
                  link.highlight
                    ? "bg-accent text-dark px-5 py-2 rounded-full hover:bg-accent-light font-semibold"
                    : "text-white/80 hover:text-accent"
                )}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* ── Mobile hamburger button ───────────────────────── */}
        <button
          className="md:hidden text-white p-2 rounded-md hover:bg-white/10 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* ── Mobile dropdown menu ──────────────────────────────── */}
      <div
        className={clsx(
          "md:hidden bg-dark/97 backdrop-blur-sm overflow-hidden transition-all duration-300",
          menuOpen ? "max-h-96 border-t border-white/10" : "max-h-0"
        )}
      >
        <ul className="px-6 py-4 space-y-1">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={handleLinkClick}
                className={clsx(
                  "block py-3 text-base font-medium transition-colors",
                  link.highlight
                    ? "text-accent font-semibold"
                    : "text-white/80 hover:text-accent"
                )}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
