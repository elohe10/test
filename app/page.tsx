// ─────────────────────────────────────────────────────────────
// Home page — single-page layout assembling all sections.
// Scroll down through: Hero → About → Process → Menu →
//                      Reviews → Reservation → Contact → Footer
// ─────────────────────────────────────────────────────────────

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Process from "@/components/Process";
import Menu from "@/components/Menu";
import Reviews from "@/components/Reviews";
import Reservation from "@/components/Reservation";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";

export default function HomePage() {
  return (
    <>
      {/* Sticky navigation bar */}
      <Navbar />

      <main>
        {/* Full-screen hero with floating drink thumbnails */}
        <section id="home">
          <Hero />
        </section>

        {/* Two-column about section with stat badges */}
        <section id="about">
          <About />
        </section>

        {/* Three-step process section */}
        <Process />

        {/* Tabbed menu grid — data comes from data/menu.json */}
        <section id="menu">
          <Menu />
        </section>

        {/* Horizontal scrolling Google Reviews carousel */}
        <section id="reviews">
          <Reviews />
        </section>

        {/* Reservation form → Supabase + WhatsApp notification */}
        <section id="reserve">
          <Reservation />
        </section>

        {/* Address, map, hours, contact links */}
        <section id="contact">
          <Contact />
        </section>
      </main>

      <Footer />

      {/* Fixed WhatsApp bubble — bottom right corner on all pages */}
      <WhatsAppFloat />
    </>
  );
}
