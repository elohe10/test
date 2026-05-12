"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

const photos = [
  {
    src: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&h=1400&fit=crop&q=80",
    alt: "Latte art at Kawa House",
    label: "Crafted with Care",
  },
  {
    src: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=700&h=700&fit=crop&q=80",
    alt: "Rwandan coffee beans",
    label: "Huye Mountain Beans",
  },
  {
    src: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=700&h=700&fit=crop&q=80",
    alt: "Warm café interior",
    label: "Our Space",
  },
  {
    src: "https://images.unsplash.com/photo-1511537190424-bbbab87ac5eb?w=700&h=800&fit=crop&q=80",
    alt: "Pour-over brewing ritual",
    label: "The Ritual",
  },
  {
    src: "https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=1200&h=800&fit=crop&q=80",
    alt: "Friends enjoying coffee together",
    label: "Huye's Living Room",
  },
];

export default function Gallery() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) entry.target.classList.add("visible");
      },
      { threshold: 0.08 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="bg-dark py-24 sm:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div ref={sectionRef} className="reveal mb-14 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-accent text-sm font-medium tracking-widest uppercase mb-4">
              The Experience
            </p>
            <h2 className="text-4xl sm:text-5xl font-serif text-white leading-tight">
              Life at Kawa House
            </h2>
          </div>
          <p className="text-white/40 text-sm max-w-xs leading-relaxed sm:text-right">
            Every cup tells a story — from the highland farms of Huye to your hands.
          </p>
        </div>

        {/* Asymmetric photo grid */}
        <div className="grid grid-cols-3 grid-rows-[420px_280px] gap-2 sm:gap-3">

          {/* [0] Large portrait — left 2 cols, full height */}
          <GalleryImage
            photo={photos[0]}
            className="col-span-2 row-span-2"
          />

          {/* [1] Top-right */}
          <GalleryImage
            photo={photos[1]}
            className="col-span-1 row-span-1"
          />

          {/* [2] Bottom-right */}
          <GalleryImage
            photo={photos[2]}
            className="col-span-1 row-span-1"
          />
        </div>

        {/* Second row: three across */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-2 sm:mt-3 h-[260px] sm:h-[300px]">

          {/* [3] Narrow left */}
          <GalleryImage
            photo={photos[3]}
            className="col-span-1"
          />

          {/* [4] Wide right */}
          <GalleryImage
            photo={photos[4]}
            className="col-span-2"
          />
        </div>

      </div>
    </section>
  );
}

function GalleryImage({
  photo,
  className = "",
}: {
  photo: { src: string; alt: string; label: string };
  className?: string;
}) {
  return (
    <div className={`group relative overflow-hidden ${className}`}>
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, 50vw"
      />

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-dark/0 group-hover:bg-dark/50 transition-colors duration-500" />

      {/* Label — slides up from bottom on hover */}
      <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
        <span className="inline-block text-white font-serif text-lg leading-tight">
          {photo.label}
        </span>
        <div className="mt-1.5 h-px w-8 bg-accent" />
      </div>
    </div>
  );
}
