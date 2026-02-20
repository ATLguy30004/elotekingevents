# HANDOFF — Elote King Events Landing Page
## CONTINUE FROM HERE
Last updated: Feb 19, 2026. Ready to deploy.

---

## STATUS: READY TO DEPLOY

Build is clean. All features wired. One command to ship.

---

## WHAT'S DONE THIS SESSION

### Pricing (finalized)
| Tier | Pre-Pay | Door | Value |
|---|---|---|---|
| The Taste | $14.99 | $22.99 | $26 |
| King's Table | $36.99 | $44.99 | $52 |
| Royal Feast | $64.99 | $74.99 | $86 |

- Menu items: Burger $13, Taquitos $13 (5 chicken), Loaded Fries $13, Drink $8, Esquite $5, Flan $8
- Inventory: Taste=10 spots (2 claimed), King's=40 spots (5 claimed), Royal=10 spots (1 claimed)
- Progress bars reflect claimed counts correctly

### Square Payment Links (wired)
- The Taste → `https://square.link/u/kNN8rlDP`
- King's Table → `https://square.link/u/owUPZT3F`
- Royal Feast → `https://square.link/u/NRHEJ7yI`

### Square Confirmation Redirects (SET THESE IN SQUARE)
Each payment link needs a redirect URL set in Square Dashboard:
- The Taste → `https://elotekingevents.com/confirmed?tier=taste`
- King's Table → `https://elotekingevents.com/confirmed?tier=kings`
- Royal Feast → `https://elotekingevents.com/confirmed?tier=royal`

### Features Added
- [x] Real testimonials from Event #1 (4 reviews between video and menu)
- [x] WhatsApp group button (fixed, bottom-right, above sticky bar) → `https://chat.whatsapp.com/FW42VSUlRdd8JuSnZ4hDWA`
- [x] SMS/waitlist form → Formspree `xzdaagpz` (phone capture, Fahim gets email on every submit)
- [x] SMS form success state — green box with ✅ confirmation
- [x] Favicon — logo PNG at `/public/favicon.ico`
- [x] Sticky bar → "Save up to 42%"
- [x] Proof toast — smaller, left-side only, doesn't overlap WhatsApp button
- [x] No restroom FAQ added
- [x] New hero video replaced (7.2MB, correct filename)

### Pages
| File | URL | What |
|---|---|---|
| `src/pages/index.astro` | `/` | Main landing page |
| `src/pages/confirmed.astro` | `/confirmed?tier=taste\|kings\|royal` | Post-payment page |
| `src/pages/cards.astro` | `/cards` | Pricing card images for Square |
| `src/pages/menu.astro` | `/menu` | Redirects to /#flights |

---

## DEPLOY — DO THIS FIRST THING NEXT CHAT

Run `/deploy` and it will handle everything automatically:
1. Build
2. Git commit + push
3. Confirm Vercel deployment

### Files to commit (DO NOT commit .claude/ folder):
- `src/pages/index.astro`
- `src/pages/confirmed.astro`
- `src/pages/cards.astro`
- `src/pages/menu.astro`
- `public/favicon.ico`
- `public/images/king-smash-burger-branded-final.png`
- `public/robots.txt`
- `public/video/EloteKing_HeroReel_LandingPage.mp4`
- `GOOGLE_APPS_SCRIPT.js`
- `GOOGLE_APPS_SCRIPT_ORDERS.js`
- `generate-cards.js`

### After deploy — DNS (have Manus do this):
- A record `@` → `76.76.21.21`
- CNAME `www` → `cname.vercel-dns.com`

---

## STILL ON FAHIM

1. **Square redirect URLs** — go into each Square payment link → After Payment → Redirect to URL → paste the 3 URLs above
2. **Apple Pay** — Square Dashboard → Settings → Checkout → Digital Wallets → Apple Pay → Enable → verify domain
3. **Formspree email verification** — check email tied to formspree.io account and verify it, otherwise phone captures won't forward
4. **DNS** — have Manus point `elotekingevents.com` to Vercel after deploy

---

## KEY NOTES FOR NEXT SESSION

- Build command: `npm run build`
- Dev server: `npm run dev -- --host` → phone preview at `http://10.0.0.26:4324`
- Inventory is hardcoded in JS — update `dropClaimed` in `index.astro` as spots sell
- Square handles purchase receipts automatically — no backend needed for that
- Google Apps Script files exist but are NOT deployed — optional enhancement for branded emails
