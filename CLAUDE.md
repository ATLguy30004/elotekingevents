# CLAUDE.md — Elote King Event #2 Waitlist Landing Page

## WHAT THIS IS
Build and deploy elotekingevents.com as an Astro static site. This is a single-page waitlist landing page for Elote King Atlanta's Event #2 (halal Mexican street food tasting, Feb 27, 2026). The reference HTML file `event2-waitlist.html` in this folder IS the complete page — match it exactly. Do not improvise. Do not change colors, copy, layout, or structure.

## STACK
- **Framework:** Astro (latest)
- **Styling:** Vanilla CSS (all styles are in the HTML file — extract into a single CSS file or keep inline)
- **Fonts:** Google Fonts — Bebas Neue + DM Sans (already linked in the HTML)
- **Hosting:** Vercel (free tier)
- **Repo:** GitHub

## PROJECT SETUP
```bash
npm create astro@latest elotekingevents -- --template minimal
cd elotekingevents
```

## FILE STRUCTURE
```
elotekingevents/
├── public/
│   ├── images/
│   │   ├── elote-king-logo-transparent.png
│   │   ├── hero_line_cropped.jpg
│   │   ├── king-smash-burger-branded-final.jpg
│   │   ├── taquitos-michelada-branded-final.jpg
│   │   ├── chorizo-drip-fries-branded-final.jpg
│   │   ├── gold-flan-royale-branded-final.jpg
│   │   ├── mango-loca-branded-final.jpg
│   │   └── michelada-branded-final.jpg
│   ├── video/
│   │   └── EloteKing_HeroReel_LandingPage.mp4
│   └── favicon.ico (use the logo or generate from it)
├── src/
│   ├── layouts/
│   │   └── Layout.astro
│   └── pages/
│       └── index.astro
├── astro.config.mjs
├── package.json
└── CLAUDE.md
```

## ASSETS
All assets are in the same folder as this CLAUDE.md file:
- `elote-king-logo-transparent.png` → `/public/images/`
- `hero_line_cropped.jpg` → `/public/images/`
- `king-smash-burger-branded-final.jpg` → `/public/images/`
- `taquitos-michelada-branded-final.jpg` → `/public/images/`
- `chorizo-drip-fries-branded-final.jpg` → `/public/images/`
- `gold-flan-royale-branded-final.jpg` → `/public/images/`
- `mango-loca-branded-final.jpg` → `/public/images/`
- `michelada-branded-final.jpg` → `/public/images/`
- `EloteKing_HeroReel_LandingPage.mp4` → `/public/video/`

Copy all assets to their respective directories. Update all `src` paths in the HTML to use `/images/filename` and `/video/filename`.

## THE PAGE
The complete page is in `event2-waitlist.html`. Convert it to `src/pages/index.astro`. The page structure from top to bottom:

1. **Badge Bar** — Black strip: "✓ 100% Zabiha Halal • Muslim-Owned • Zero Alcohol"
2. **Logo Bar** — White bar, centered Elote King logo (transparent PNG), 52px height
3. **Hero** — `hero_line_cropped.jpg` with dark gradient overlay, "EVENT #1 SOLD OUT" red badge top-right, headline "Event #1 Sold Out. Don't Miss #2.", subhead "Friday, Feb 27 • 9:30 PM • Alpharetta, GA"
4. **Waitlist Form** — "Get On The Waitlist" headline, email + phone inputs, green "Get Early Access →" button
5. **Social Proof Strip** — Three columns: "50 Flights claimed", "48hr Until sold out", "$0 Ad spend"
6. **Video Section** — "The Event #1 Experience" heading, square video player with play button overlay, uses `EloteKing_HeroReel_LandingPage.mp4`, poster is `hero_line_cropped.jpg`
7. **Menu Grid** — "What's On The Menu" heading, 2x3 grid with branded food images:
   - King Smash Burger
   - Taquito Michelada (tag: FIRST IN ATLANTA)
   - Chorizo Drip Fries
   - Gold Flan Royale
   - Mango Loca
   - Michelada (tag: NOBODY ELSE HAS THIS)
8. **Timeline** — "How The Drop Works" — 3 steps with green/gray dots
9. **Bottom Form** — "Don't Wait For Feb 24." with email + phone form repeat
10. **FAQ** — 8 accordion items (details/summary)
11. **Trust Bar** — "100% Zabiha Halal • Muslim-Owned • Zero Alcohol • Alpharetta 30004"
12. **Footer** — Copyright, links
13. **Sticky Bar** — Fixed bottom bar with "Join the Waitlist →" green button

## CRITICAL DESIGN SPECS — DO NOT CHANGE
- **Background:** WHITE (#ffffff). NOT dark. NOT black.
- **Font:** DM Sans body, Bebas Neue headings
- **Green:** #16a34a (buttons, accents, tags, timeline dots)
- **Text colors:** Primary #111111, Body #333333, Secondary #444444, Muted #555555
- **Body font size:** 16px minimum. No text smaller than 13px anywhere.
- **Mobile-first:** page is designed for phones (60%+ mobile traffic)
- **Border radius:** 12px cards, 16px larger elements, 10px buttons/inputs
- **Sticky bar:** Always visible at bottom with green CTA button

## FORM HANDLING
The forms collect email + phone. For now, wire them to one of these (in order of preference):
1. **Formspree** — Create a form endpoint, action="https://formspree.io/f/{id}"
2. **Google Sheets via Apps Script** — If you can set this up
3. **Netlify Forms** — If deploying to Netlify instead
4. **Just leave action="#"** — Owner will connect later

Add a simple success state: after submit, replace form with "You're on the list. Watch your phone." message.

## SEO
```html
<title>Elote King Event #2 — Waitlist | Halal Mexican Street Food | Feb 27</title>
<meta name="description" content="Event #1 sold out. Don't miss Event #2. Join the waitlist for Atlanta's only halal Mexican street food tasting experience. Friday Feb 27, Alpharetta GA." />
<meta property="og:title" content="Elote King Event #2 — Don't Miss It" />
<meta property="og:description" content="Event #1 sold out in 48 hours. Get on the waitlist for Event #2. Feb 27, Alpharetta GA." />
<meta property="og:image" content="/images/hero_line_cropped.jpg" />
<meta property="og:type" content="website" />
<link rel="canonical" href="https://elotekingevents.com" />
```

## DEPLOYMENT

### Step 1: GitHub
```bash
git init
git add .
git commit -m "Event #2 waitlist page"
gh repo create elotekingevents --public --source=. --push
```
If `gh` CLI not available, create repo manually on github.com and push:
```bash
git remote add origin https://github.com/OWNER/elotekingevents.git
git branch -M main
git push -u origin main
```

### Step 2: Vercel
1. Go to vercel.com → Import from GitHub → Select `elotekingevents`
2. Vercel auto-detects Astro, deploys
3. Add custom domain: elotekingevents.com
4. DNS: Point domain to Vercel (A record: 76.76.21.21, or CNAME to cname.vercel-dns.com)

### Step 3: Verify
- [ ] Page loads at elotekingevents.com
- [ ] Logo shows
- [ ] Hero image loads
- [ ] Video plays on tap
- [ ] All 6 food images load
- [ ] Forms submit (or show placeholder success)
- [ ] Sticky bar scrolls to form
- [ ] Mobile looks correct (test at 375px width)
- [ ] All text is readable (nothing washed out or too small)

## ASTRO CONFIG
```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
export default defineConfig({
  site: 'https://elotekingevents.com',
});
```

## DO NOT
- Do NOT change the background to dark/black
- Do NOT change any menu item names
- Do NOT add new sections or remove any sections
- Do NOT change the copy — every word is finalized
- Do NOT use a CSS framework (Tailwind, Bootstrap) — vanilla CSS only
- Do NOT optimize/compress the images (they're already sized correctly)
- Do NOT add analytics or tracking scripts (owner will add later)
