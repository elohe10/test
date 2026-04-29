# Kawa House — Website

Specialty coffee shop website built with Next.js 14, Tailwind CSS, Supabase, and Twilio.

---

## Quick Start (local development)

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.local.example .env.local
# Then open .env.local and fill in your real values (see below)

# 3. Run the development server
npm run dev
# Open http://localhost:3000
```

---

## How to Update the Menu

The menu lives in **`data/menu.json`**. You can edit it without touching any code.

### Structure

```json
{
  "coffee": [ ... ],      ← Coffee tab
  "specialty": [ ... ],   ← Specialty Drinks tab
  "snacks": [ ... ]       ← Snacks & Bites tab
}
```

### Each item looks like this:

```json
{
  "id": "c7",
  "name": "Americano",
  "price": 2800,
  "description": "Espresso diluted with hot water for a smooth, full-bodied cup.",
  "image": "https://images.unsplash.com/photo-XXXXXXX?w=400&h=300&fit=crop"
}
```

**Rules:**
- `id` must be unique (use any string, e.g. `c7`, `s7`, `sn7`)
- `price` is in Rwandan Francs (RWF) — no currency symbol, just the number
- `image` — for now use an Unsplash URL. When you have real photos, upload them to `/public/images/` and use `/images/your-photo.jpg`

---

## How to Change Colors

Open **`tailwind.config.ts`** and find the `colors` section:

```ts
brand: {
  DEFAULT: "#6B3F1F",   ← Main brown — used for text, badges
  light: "#A0522D",
  dark: "#3E1F0A",
},
accent: {
  DEFAULT: "#D4A853",   ← Golden amber — used for buttons, highlights
  light: "#F0C87A",
  dark: "#A07830",
},
```

Change these hex values and the entire site updates automatically.

---

## How to Connect Supabase

### 1. Create the reservations table

Log in to [supabase.com](https://supabase.com), go to your project → **SQL Editor**, and run:

```sql
-- Create the reservations table
CREATE TABLE reservations (
  id          BIGSERIAL PRIMARY KEY,
  full_name   TEXT NOT NULL,
  phone       TEXT NOT NULL,
  date        DATE NOT NULL,
  time        TIME NOT NULL,
  guests      INTEGER NOT NULL CHECK (guests > 0),
  special_requests TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Optional: Enable Row Level Security
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Allow the API (anon key) to insert reservations
CREATE POLICY "Allow inserts from anon"
  ON reservations FOR INSERT
  TO anon
  WITH CHECK (true);
```

### 2. Add your Supabase keys to `.env.local`

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```

Find these in: Supabase Dashboard → Project Settings → API

---

## How to Set Up Twilio WhatsApp (Owner Alerts)

### 1. Create a Twilio account at [twilio.com](https://twilio.com)

### 2. Set up the WhatsApp sandbox (for testing)

- Go to Twilio Console → Messaging → Try it out → Send a WhatsApp message
- Follow the sandbox join instructions (send a code from your phone)
- Your sandbox number will be something like `whatsapp:+14155238886`

### 3. For production (real WhatsApp number)

- Apply for a Twilio WhatsApp Business sender through the Twilio Console
- This requires a verified Facebook Business account

### 4. Add to `.env.local`

```env
TWILIO_ACCOUNT_SID=AC847297b2bc328dd9386a77123bc76971
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
OWNER_WHATSAPP_NUMBER=whatsapp:+250792560660
```

---

## How to Add the Google Maps Embed

1. Go to [maps.google.com](https://maps.google.com)
2. Search for your exact location
3. Click **Share** → **Embed a map** → Copy the HTML
4. Open `components/Contact.tsx`
5. Find the comment `TO ADD YOUR GOOGLE MAP:` and replace the placeholder div with your iframe:

```tsx
<iframe
  src="https://www.google.com/maps/embed?pb=YOUR_EMBED_URL"
  width="100%"
  height="100%"
  style={{ border: 0 }}
  allowFullScreen
  loading="lazy"
  referrerPolicy="no-referrer-when-downgrade"
  title="Kawa House location"
/>
```

---

## How to Activate Google Analytics 4

1. Go to [analytics.google.com](https://analytics.google.com)
2. Create a new property → get your Measurement ID (looks like `G-XXXXXXXXXX`)
3. Open `app/layout.tsx`
4. Find the commented-out GA4 script tags
5. Replace `G-XXXXXXXXXX` with your real ID and **uncomment** both script tags

---

## How to Deploy to Vercel

### First deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy (follow prompts)
vercel

# Or connect your GitHub repo at vercel.com for automatic deployments
```

### Add environment variables to Vercel

1. Go to [vercel.com](https://vercel.com) → Your project → **Settings** → **Environment Variables**
2. Add all variables from your `.env.local` file
3. Redeploy

### Your free Vercel URL (no domain needed)

Vercel automatically assigns a free URL the moment you deploy — something like `kawa-house.vercel.app`. You can use this to go live immediately without buying a domain.

### Add a custom domain later (optional)

When you buy a domain (e.g. `kawahouse.rw`):
1. Vercel Dashboard → Your project → **Settings** → **Domains**
2. Add your domain (e.g. `kawahouse.rw`)
3. Update your DNS records as instructed by Vercel
4. Update `NEXT_PUBLIC_SITE_URL` in your Vercel environment variables to your real domain

---

## How to Replace Placeholder Images

All images currently use Unsplash URLs. When you have real photos:

1. Create a folder: `public/images/`
2. Add your photos there (e.g. `espresso.jpg`, `shop-interior.jpg`)
3. Update the relevant component:
   - Hero background: `components/Hero.tsx` → change the `src` on the background `<Image>`
   - About photo: `components/About.tsx`
   - Menu items: `data/menu.json` → change `"image"` values to `/images/your-photo.jpg`

**Recommended image sizes:**
- Hero background: 1920×1080px
- About / section photos: 700×875px (portrait)
- Menu item cards: 400×300px

---

## Project Structure

```
kawa-house/
├── app/
│   ├── layout.tsx          ← Global layout, metadata, GA4 placeholder
│   ├── page.tsx            ← Single-page assembly
│   ├── globals.css         ← Base styles, scroll animation utilities
│   └── api/reserve/route.ts ← Reservation API (Supabase + Twilio)
├── components/
│   ├── Navbar.tsx          ← Sticky nav with mobile hamburger
│   ├── Hero.tsx            ← Full-screen hero + drink thumbnails
│   ├── About.tsx           ← Two-column about + stat badges
│   ├── Process.tsx         ← Three-step process
│   ├── Menu.tsx            ← Tabbed menu grid
│   ├── Reviews.tsx         ← Auto-scrolling review carousel
│   ├── Reservation.tsx     ← Booking form
│   ├── Contact.tsx         ← Map + contact info
│   ├── Footer.tsx          ← Footer with socials
│   └── WhatsAppFloat.tsx   ← Fixed WhatsApp bubble
├── data/
│   └── menu.json           ← All menu items (edit this to update the menu)
├── lib/
│   ├── supabase.ts         ← Supabase client
│   └── twilio.ts           ← Twilio WhatsApp helper
├── public/
│   └── logo.svg            ← Site logo
└── .env.local.example      ← Template for environment variables
```

---

## Support

For questions about this website, contact the developer or refer to:
- [Next.js docs](https://nextjs.org/docs)
- [Supabase docs](https://supabase.com/docs)
- [Twilio WhatsApp docs](https://www.twilio.com/docs/whatsapp)
- [Vercel docs](https://vercel.com/docs)
