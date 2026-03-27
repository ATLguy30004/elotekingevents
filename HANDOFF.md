# HANDOFF — Elote King Events Site
## Last updated: March 26, 2026

---

## START HERE — READ THIS FIRST

**Project:** `C:\Users\dangr\Projects\elotekingevents-deploy`
**Live:** `events.elotekingatlanta.com` (Vercel auto-deploys on push to `main`)
**Repo:** `github.com/ATLguy30004/elotekingevents.git`

### Critical: TWO bull ride pages exist

| What Fahim uses | File |
|---|---|
| `events.elotekingatlanta.com/` (homepage) | `src/pages/index.astro` — **EDIT THIS ONE** |
| `events.elotekingatlanta.com/bull-ride-march28/` | `src/pages/bull-ride-march28/index.astro` — copy of same event |

**Always edit `index.astro` first.** That's the URL Fahim opens. Apply to both if they should match.

### Ignore: `elote-events-prod-deploy` is a SEPARATE project. Don't touch it.

---

## PAGE STRUCTURE (index.astro — ~1900 lines)

7 sections:
1. **Hero** (line ~418) — fullscreen video bg + H1 "One Bull. One Night." + date line. No CTAs, no FOMO bar (removed March 26).
2. **FOMO Ticker** (line ~535) — orange scrolling marquee
3. **The Challenge** (line ~550) — two-col: copy + photo grid + "CLAIM MY FREE RIDE" CTA
4. **Prizes** (line ~600) — 3 tier cards (8s/12s/20s hold times)
5. **Menu** (line ~700) — horizontal scroll food cards
6. **Social Proof** (line ~800) — video testimonials grid
7. **Closer** (line ~900) — final CTA with FOMO counter + progress bar

---

## WHAT WAS DONE March 26

- Removed FOMO bar + CTAs + sticky bar from hero (both pages)
- Fixed video autoplay: direct `src` on `<video>` instead of `<source>` child
- Removed `<link rel="preload" as="video">` (blocks mobile autoplay)
- Hero text pushed to `bottom: 24px`
- Added `vercel.json` with `Cache-Control: must-revalidate` for HTML

---

## DEV SERVER

```bash
cd C:\Users\dangr\Projects\elotekingevents-deploy
npx astro dev --port 4322
```

Note: Claude Code CWD may not be this folder. Use Bash to start from correct dir if `preview_start` loads wrong site. There's a `.claude/launch.json` but it only works if CWD matches.

---

## STACK
Astro static | Vanilla CSS (no Tailwind) | Bebas Neue + DM Sans (self-hosted woff2) | Vercel free | GitHub | Formspree

---

## VIDEO AUTOPLAY
iOS requires: `muted` + `playsinline` + `webkit-playsinline`. Direct `src` attr > `<source>` child. JS retry logic at bottom of file (5 attempts). If video won't play — iOS restriction, not code bug.

---

## OTHER PAGES
| File | URL | What |
|---|---|---|
| `src/pages/confirmed.astro` | `/confirmed?tier=taste\|kings\|royal` | Post-payment confirmation |
| `src/pages/cards.astro` | `/cards` | Pricing card images for Square |
| `src/pages/event3.astro` | `/event3` | Event 3 page |
| `src/pages/share.astro` | `/share` | Share page |
| `src/pages/menu.astro` | `/menu` | Menu redirect |

---

## DNS / DOMAINS
- `events.elotekingatlanta.com` → CNAME to Vercel (working)
- `elotekingevents.com` → Manus domain, DNS not pointed, not working
- Namecheap DNS: DO NOT change A record or www CNAME (keeps main site alive)
