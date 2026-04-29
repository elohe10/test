// ─────────────────────────────────────────────────────────────
// Root layout — wraps every page on the site.
// This is where we set global metadata, fonts, and analytics.
// ─────────────────────────────────────────────────────────────

import type { Metadata } from "next";
import "./globals.css";

// ── Site metadata (shows in browser tab and Google search results) ──
// metadataBase is required by Next.js 14 when using Open Graph URLs.
// It defaults to localhost in development and uses your real URL in production.
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  title: "Kawa House — Specialty Coffee in Huye, Rwanda",
  description:
    "Kawa House is a specialty coffee shop in Huye, Rwanda, serving 100% Rwandan beans, specialty drinks, and fresh bites. Open daily 7AM–9PM.",
  keywords: ["coffee", "Rwanda", "Huye", "café", "specialty coffee", "Kawa House"],
  openGraph: {
    title: "Kawa House — Specialty Coffee in Huye, Rwanda",
    description: "100% Rwandan beans. Expertly brewed. Open daily 7AM–9PM.",
    siteName: "Kawa House",
    locale: "en_RW",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* ─────────────────────────────────────────────────────
            GOOGLE ANALYTICS 4
            To activate GA4:
            1. Go to https://analytics.google.com
            2. Create a property → get your Measurement ID (e.g. G-XXXXXXXXXX)
            3. Replace G-XXXXXXXXXX below with your real ID
            4. Uncomment the two script tags below
        ───────────────────────────────────────────────────── */}

        {/* <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
        /> */}
        {/* <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XXXXXXXXXX');
            `,
          }}
        /> */}
      </head>
      <body>{children}</body>
    </html>
  );
}
