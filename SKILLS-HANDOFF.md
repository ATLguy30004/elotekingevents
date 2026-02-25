# SKILLS HANDOFF — Elote King Event #2
**Date:** Feb 20, 2026 | **Event:** Feb 27, 2026 — 7 days out

---

## WHAT SKILLS EXIST

Fahim has a full suite of Claude Code skills installed globally at:
`C:\Users\dangr\.claude\skills\`

These are invoked with a `/skill-name` command or via the Skill tool.

---

## SKILLS USED SO FAR (THIS PROJECT)

| Skill | Used | Notes |
|---|---|---|
| `/deploy` | ✅ Yes | Build → sanity check → commit → push → Vercel confirm |
| `/nano-banana` | ✅ Yes | Gemini image generation (API key needs replacing — was exposed) |
| `/design-system` | ⚠️ Mentioned | Never actually invoked — CSS was written manually |

---

## SKILLS TO RUN NEXT (PRIORITIZED FOR 7 DAYS TO EVENT)

### 🔴 CRITICAL — Do this week

#### 1. `/analytics-setup`
**Why:** The landing page (events.elotekingatlanta.com) has Vercel Analytics but NO conversion tracking. You don't know who's clicking the Square pay buttons, how far people scroll, or where they drop off. Vercel Analytics only gives pageviews.
**What to ask it:** "Set up GA4 + Meta Pixel conversion tracking on the Elote King events site. Track: Square button clicks as conversions, SMS form submits, time-on-page."

#### 2. `/launch-playbook`
**Why:** 7 days to the event. Need a structured day-by-day content and outreach plan.
**What to ask it:** "Build a 7-day launch playbook for Elote King Event #2. Feb 27 in Alpharetta. Pre-pay tasting flights. Target: halal-conscious Atlanta Muslims + foodies. Channels: WhatsApp, Instagram, word-of-mouth. Goal: sell remaining pre-pay spots."

#### 3. `/campaign-planner`
**Why:** Need structured WhatsApp blast sequences and Instagram post schedule.
**What to ask it:** "Plan a 7-day WhatsApp + Instagram campaign for Elote King Event #2. Tasting flights from $14.99 pre-pay. Feb 27, Alpharetta. Target: Atlanta Muslim community + halal food seekers. Include message scripts, timing, and what assets to use (the flyer at /cards, the share page at /share)."

---

### 🟡 IMPORTANT — Run right after the event

#### 4. `/testimonial-harvester`
**Why:** Founders who attend are your best social proof for Event #3. Need a system to capture their reactions while they're still there (or same night).
**What to ask it:** "Build a testimonial collection system for Elote King. We need founder reactions captured at/after Event #2 on Feb 27. Options: WhatsApp voice note request, Google Review ask, Instagram story tag. Build the scripts and follow-up sequence."

#### 5. `/retention-engine`
**Why:** Keep founders warm for Event #3. Don't let them go cold after the event.
**What to ask it:** "Build a post-event retention sequence for Elote King founder members. They just attended Event #2 on Feb 27. Goal: keep them engaged and pre-sell Event #3. Channels: SMS/WhatsApp. Include: thank you message, behind-the-scenes tease, early Event #3 access offer."

---

### 🟢 GOOD TO HAVE — When there's time

#### 6. `/content-atomizer`
**What:** Take the /cards flyer + /share page + video → turn into 5-10 pieces of social content (IG captions, WhatsApp messages, Stories text).

#### 7. `/local-authority-builder`
**What:** Optimize Elote King's Google Business Profile for "halal food Atlanta", "halal Mexican food Alpharetta", etc.

#### 8. `/audit` + `/deploy-preflight`
**What:** Run a full quality check on the live site before each major push. Should be running this before every deploy — hasn't been.

---

## CURRENT PROJECT STATE

| Page | URL | Status |
|---|---|---|
| Landing page | events.elotekingatlanta.com | ✅ Live |
| Print flyer | /print | ✅ Live — 8.5×11 printable |
| Founder's tasting flyer | /cards | ✅ Live — 6 food photos + add-ons |
| WhatsApp share | /share | ✅ Live |
| Confirmed | /confirmed | ✅ Live |

**Git tag for rollback:** `backup-feb20-stable`
To restore: `git checkout backup-feb20-stable -- src/pages/index.astro`

**Square payment links:**
- The Taste: https://square.link/u/hW5xoQ5c ($14.99)
- King's Table: https://square.link/u/owUPZT3F ($36.99)
- Royal Feast: https://square.link/u/NRHEJ7yI ($64.99)

**Gemini API key:** Was exposed in a previous session — needs to be regenerated at aistudio.google.com/apikey before using /nano-banana again.

---

## HOW TO START THE NEXT CHAT

Paste this at the start of your new Claude Code session:

```
I'm Fahim. Working on Elote King Event #2 (Feb 27, Alpharetta GA).
Site: events.elotekingatlanta.com
Project: C:\Users\dangr\Projects\elote-king-events\elotekingevents

Read CLAUDE.md and BRAND.md before doing anything.
Git tag backup-feb20-stable = safe rollback point.

I want to run /launch-playbook for the next 7 days to the event.
```
