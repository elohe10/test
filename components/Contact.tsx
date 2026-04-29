"use client";

// ─────────────────────────────────────────────────────────────
// Contact & Location section
// - Shop address and phone (clickable)
// - WhatsApp button
// - Google Maps embed placeholder
// - Opening hours table
// ─────────────────────────────────────────────────────────────

import { useEffect, useRef } from "react";
import { MapPin, Phone, Clock, Mail } from "lucide-react";

const hours = [
  { day: "Monday – Sunday", time: "7:00 AM – 9:00 PM" },
];

export default function Contact() {
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
    <section className="bg-cream py-24 sm:py-32">
      <div
        ref={sectionRef}
        className="reveal max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16"
      >

        {/* ── Left: contact info + hours ────────────────────── */}
        <div className="space-y-10">
          {/* Section header */}
          <div>
            <p className="text-accent text-sm font-medium tracking-widest uppercase mb-4">
              Find Us
            </p>
            <h2 className="text-4xl sm:text-5xl font-serif text-dark leading-tight">
              Visit Kawa House
            </h2>
          </div>

          {/* Contact details */}
          <div className="space-y-5">
            {/* Address */}
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center shrink-0 mt-0.5">
                <MapPin size={18} className="text-brand" />
              </div>
              <div>
                <p className="text-dark font-medium text-sm mb-0.5">Address</p>
                <p className="text-dark/60 text-sm leading-relaxed">
                  Huye, Southern Province
                  <br />
                  Rwanda
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center shrink-0">
                <Phone size={18} className="text-brand" />
              </div>
              <div>
                <p className="text-dark font-medium text-sm mb-0.5">Phone</p>
                <a
                  href="tel:+250792560660"
                  className="text-dark/60 text-sm hover:text-brand transition-colors"
                >
                  +250 792 560 660
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center shrink-0">
                <Mail size={18} className="text-brand" />
              </div>
              <div>
                <p className="text-dark font-medium text-sm mb-0.5">Email</p>
                <a
                  href="mailto:info@kawahouse.rw"
                  className="text-dark/60 text-sm hover:text-brand transition-colors"
                >
                  info@kawahouse.rw
                </a>
              </div>
            </div>

            {/* Opening hours */}
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center shrink-0 mt-0.5">
                <Clock size={18} className="text-brand" />
              </div>
              <div>
                <p className="text-dark font-medium text-sm mb-2">Opening Hours</p>
                <div className="space-y-1.5">
                  {hours.map((h) => (
                    <div key={h.day} className="flex items-center gap-4">
                      <span className="text-dark/60 text-sm w-40">{h.day}</span>
                      <span className="text-dark font-medium text-sm">{h.time}</span>
                    </div>
                  ))}
                </div>
                <p className="text-accent text-xs mt-2 font-medium">
                  Open every day including public holidays
                </p>
              </div>
            </div>
          </div>

          {/* WhatsApp button */}
          <a
            href="https://wa.me/250792560660?text=Hello%2C%20I%20would%20like%20to%20enquire%20about%20Kawa%20House"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#20BA5A] text-white font-semibold px-6 py-3.5 rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-green-500/25 hover:-translate-y-0.5"
          >
            {/* WhatsApp logo SVG */}
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
            Chat on WhatsApp
          </a>
        </div>

        {/* ── Right: Google Maps embed ──────────────────────── */}
        <div className="rounded-3xl overflow-hidden shadow-xl border border-dark/10 min-h-80 bg-dark/5 flex items-center justify-center">
          {
            <iframe
              src="https://www.google.com/maps/embed?pb=!4v1777392211939!6m8!1m7!1sTnND--mApT9xPLJpdoSzhw!2m2!1d-2.599484315038511!2d29.74215970056198!3f201.62178285126168!4f14.657584683357868!5f0.4000000000000002"
              width="100%"
              height="100%"
              style={{border: '0'}}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Kawa House location"
            ></iframe>
          }
          <div className="text-center p-8">
            <MapPin size={48} className="text-brand/30 mx-auto mb-4" />
            <p className="text-dark/40 text-sm font-medium">Google Maps</p>
            <p className="text-dark/25 text-xs mt-1 max-w-xs">
              Paste your Google Maps iframe here. See the comment in Contact.tsx for instructions.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
