# HANDOFF — Elote King Events Landing Page
## CONTINUE FROM HERE
Last updated: Feb 20, 2026. Site is LIVE.

---

## STATUS: DEPLOYED & LIVE

Site is live at **events.elotekingatlanta.com** and **elotekingevents.vercel.app**.

Build is clean. All tests pass. Vercel auto-deploys on every push to `main`.

---

## LIVE URLS
| URL | What |
|-----|------|
| `events.elotekingatlanta.com` | Primary URL (custom domain via Namecheap) |
| `elotekingevents.vercel.app` | Vercel default URL (also works) |
| `elotekingevents.com` | Manus domain — NOT working yet (DNS not pointed) |

---

## WHAT WAS DONE THIS SESSION (Feb 19-20)

### Deployed to Vercel
- Built, committed, pushed to GitHub (`ATLguy30004/elotekingevents`)
- Connected to Vercel project `elotekingevents`
- Vercel Analytics installed (`@vercel/analytics`)

### DNS / Domain Setup
- `events.elotekingatlanta.com` → CNAME to Vercel (working, green)
- Namecheap DNS switched from Web Hosting DNS to BasicDNS
- Added: A `@` → `68.65.120.98` (main site), CNAME `www` → `elotekingatlanta.com`, CNAME `events` → Vercel, TXT `_vercel` → verification
- `elotekingevents.com` (Manus) still not pointed — Manus won't let edit/delete DNS records. Need to transfer domain or get Manus support to change nameservers.

### Bug Fixes
- **SMS form was broken** — Astro tree-shook the `handleSmsSubmit` function. Fixed with `<script is:inline>`
- **SMS form success state** — now only shows after confirmed Formspree submission (not fire-and-forget)
- **Desktop layout** — hero, badge bar, proof strip now full-width (removed 1200px max-width)
- **Video caching** — added `?v=2` cache buster to force new video
- **Logo linked** — tapping logo goes to `elotekingatlanta.com`
- **"Not ready to pre-pay?" link** — added below pricing cards, scrolls to SMS capture form

### Full Test Results (all PASS)
- All pages load with SSL (index, confirmed, menu, cards)
- Formspree SMS form submits successfully (form ID: `xzdaagpz`)
- All 3 Square payment links work (Taste, King's Table, Royal Feast)
- All 8 images load (logo, hero, 6 food items)
- Video loads (cache-busted)
- Favicon loads
- WhatsApp group link works
- Logo links to main site
- SEO tags present (title, description, OG, canonical)

---

## PRICING (unchanged)
| Tier | Pre-Pay | Door | Value |
|---|---|---|---|
| The Taste | $14.99 | $22.99 | $26 |
| King's Table | $36.99 | $44.99 | $52 |
| Royal Feast | $64.99 | $74.99 | $86 |

Inventory: Taste=10 (2 claimed), King's=40 (5 claimed), Royal=10 (1 claimed)
Update `dropClaimed` object in `index.astro` as spots sell.

---

## SQUARE PAYMENT LINKS
- The Taste → `https://square.link/u/kNN8rlDP`
- King's Table → `https://square.link/u/owUPZT3F`
- Royal Feast → `https://square.link/u/NRHEJ7yI`

### Redirect URLs (SET THESE IN SQUARE DASHBOARD)
- The Taste → `https://events.elotekingatlanta.com/confirmed?tier=taste`
- King's Table → `https://events.elotekingatlanta.com/confirmed?tier=kings`
- Royal Feast → `https://events.elotekingatlanta.com/confirmed?tier=royal`

---

## PAGES
| File | URL | What |
|---|---|---|
| `src/pages/index.astro` | `/` | Main landing page |
| `src/pages/confirmed.astro` | `/confirmed?tier=taste\|kings\|royal` | Post-payment confirmation |
| `src/pages/cards.astro` | `/cards` | Pricing card images for Square |
| `src/pages/menu.astro` | `/menu` | Redirects to /#flights |

---

## NEXT UP — TODO FOR NEXT SESSION

### Tracking Pixels (Fahim getting IDs)
- [ ] **Meta/Facebook Pixel** — need Pixel ID from Meta Events Manager
- [ ] **TikTok Pixel** — need Pixel ID from TikTok Ads Manager
- [ ] **Google Analytics (GA4)** — need Measurement ID (G-XXXXXXXXXX)
- Install all 3 in one push once IDs are provided

### Still on Fahim
1. **Square redirect URLs** — set After Payment redirect to the 3 URLs above (use `events.elotekingatlanta.com` not `elotekingevents.com`)
2. **Apple Pay** — Square Dashboard → Settings → Checkout → Digital Wallets → Enable
3. **Formspree email verification** — verify email at formspree.io so phone captures forward to you
4. **Manus domain** — either get Manus to change nameservers to `ns1.vercel-dns.com` / `ns2.vercel-dns.com`, or transfer domain out to Namecheap/Cloudflare

### OG Image / Canonical URL
- Currently references `elotekingevents.com` — update to `events.elotekingatlanta.com` if Manus domain stays broken

---

## KEY COMMANDS
| Command | What |
|---------|------|
| `npm run build` | Build the site |
| `npm run dev -- --host` | Dev server with phone preview |
| `git push origin main` | Push to GitHub → Vercel auto-deploys |

---

## NAMECHEAP DNS (elotekingatlanta.com)
Current records:
| Type | Host | Value |
|------|------|-------|
| A | @ | 68.65.120.98 |
| CNAME | www | elotekingatlanta.com. |
| CNAME | events | 6061bf1d8dc8eea9.vercel-dns-017.com. |
| TXT | _vercel | vc-domain-verify=events.elotekingatlanta.com,2754f403812d3519a36c |

DO NOT change the A record or www CNAME — those keep the main site alive.
