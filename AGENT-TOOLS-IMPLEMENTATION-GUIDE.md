# Agent Tools Implementation Guide
## Production Workflows for Claude-Extending Tools
**Written for:** Fahim — Elote King Atlanta, Creative Labs, Realty Gulfa
**Date:** February 21, 2026
**Scope:** Business-grade implementation, not toy demos

---

## How to Read This Guide

Each tool section has the same structure:
1. Full Windows 11 setup with exact commands
2. Specific workflows with example prompts that actually work
3. Failure modes and fixes (not the obvious ones — the ones that bite you at 2am)
4. Real cost math at 100 / 1,000 / 10,000 units
5. Time savings vs. doing it manually

Where a tool is "community-built" vs "official," I've flagged it. Community tools can disappear or break without warning. Official tools are production-stable.

---

## Priority 1: Highest Impact

---

# 1. ElevenLabs MCP — Voice + Phone

**Status:** Official production MCP from ElevenLabs
**Repo:** github.com/elevenlabs/elevenlabs-mcp
**Why it matters for you:** Claude can make real outbound phone calls, generate branded voiceovers, and clone your voice for consistent content narration — all from a single prompt.

---

## 1.1 Windows 11 Setup

### Prerequisites
- Node.js 18+ installed
- Claude Code installed and authenticated
- ElevenLabs account (free tier works for setup; paid for production)

### Step 1: Get your ElevenLabs API key

```
elevenlabs.io → Sign in → Profile → API Keys → Create API Key
```

Copy the key. It looks like: `sk_...`

### Step 2: Add the MCP to Claude Code

```bash
# Set your API key as an environment variable first
# On Windows 11, add to your shell profile or set per-session:
export ELEVENLABS_API_KEY="sk_your_key_here"

# Add the MCP
claude mcp add elevenlabs -- npx -y @elevenlabs/elevenlabs-mcp
```

### Step 3: Verify installation

```bash
claude mcp list
# Should show: elevenlabs
```

### Step 4: Add API key permanently (Windows 11)

Open PowerShell as Administrator and run:

```powershell
[System.Environment]::SetEnvironmentVariable("ELEVENLABS_API_KEY", "sk_your_key_here", "User")
```

Then restart your terminal. The MCP picks up the env variable automatically on launch.

### Step 5: Confirm it works in Claude Code

```
/mcp
# Should list elevenlabs with its tools
```

Available tools after setup:
- `text_to_speech` — Generate audio from text
- `voice_clone` — Create a voice clone from audio samples
- `text_to_sound_effects` — Generate sound effects
- `speech_to_text` — Transcribe audio
- `voice_changer` — Apply a voice to existing audio
- `create_agent` — Build a conversational voice agent (the phone call tool)

---

## 1.2 Workflow: Automated Outbound Calls for Event Waitlist Confirmations

This is the workflow that confirms waitlist signups via a real phone call — not just a text.

### What it does
When someone joins the Elote King Event #2 waitlist, an AI voice agent calls them within 5 minutes, confirms their spot, tells them what to expect, and answers basic questions. The voice sounds like a real brand rep.

### Architecture

```
Waitlist Form Submit (Formspree)
  → n8n webhook receives submission
  → ElevenLabs MCP: create_agent call
  → Agent dials the phone number
  → Caller hears branded voice + confirmation
  → Call transcript stored in n8n
  → GHL pipeline updated to "Confirmed — Called"
```

### Step 1: Create a conversational voice agent in ElevenLabs

Go to elevenlabs.io → Conversational AI → Create Agent

Agent configuration:
```
Name: Elote King Waitlist Confirm
Voice: Rachel (or your cloned voice — see Section 1.4)
System Prompt:
---
You are the Elote King event coordinator calling to confirm a waitlist spot.
You are warm, excited, and brief. You never say "AI" or "automated."

Your call script:
1. Introduce yourself: "Hi, this is [your name] from Elote King Atlanta."
2. Confirm: "I'm calling because you just signed up for our Event #2 waitlist —
   the halal Mexican street food tasting on February 27th in Alpharetta."
3. Deliver good news: "You're on the list. We'll text you 48 hours before
   tickets drop so you get first access."
4. Ask one qualifying question: "Quick question — how many people are you
   thinking of bringing? Just so we can plan."
5. Close: "Perfect. Watch for our text. This one's going to sell out faster
   than Event #1. See you there."

If they ask about price: "Tickets will be priced around [price]. We'll confirm
exact pricing when we send your early access link."
If they ask about halal: "Yes, 100% Zabiha halal, Muslim-owned, zero alcohol."
If they ask anything you don't know: "I'll have someone follow up with you —
what's the best way to reach you?"
---
```

Save the agent. Copy the Agent ID (looks like: `agent_abc123`).

### Step 2: Build the n8n workflow

```
WORKFLOW: eloteking-waitlist-call-confirm
TRIGGER: Webhook (POST from Formspree)

NODES:
1. Webhook node
   - URL: your-n8n-instance/webhook/waitlist-confirm
   - Method: POST
   - Parse: name, email, phone from form data

2. Wait node
   - 3 minutes (let them settle after submitting)

3. HTTP Request node — ElevenLabs Outbound Call
   - Method: POST
   - URL: https://api.elevenlabs.io/v1/convai/twilio/outbound-call
   - Headers: xi-api-key: {{$env.ELEVENLABS_API_KEY}}
   - Body:
     {
       "agent_id": "agent_abc123",
       "agent_phone_number_id": "your-phone-number-id",
       "to_number": "{{$json.phone}}"
     }

4. GHL node — Update contact
   - Find contact by email
   - Add tag: "waitlist-call-sent"
   - Move to pipeline stage: "Called — Awaiting Confirmation"

5. Error Trigger node
   - If call fails: send SMS fallback via Twilio
     "Hey [name], you're on the Elote King Event #2 waitlist.
     We'll text you 48hrs before tickets drop. — Elote King Team"
```

### Step 3: Connect Twilio phone number to ElevenLabs

ElevenLabs uses Twilio under the hood for phone calls.

```
elevenlabs.io → Conversational AI → Phone Numbers → Add Number
→ Connect your Twilio account
→ Import your existing Twilio number OR buy a new one
```

Once connected, your agent has a real phone number to call from.

### Step 4: Wire Formspree to n8n

In your Formspree form settings:
```
Integrations → Webhooks → Add webhook
URL: https://your-n8n-instance/webhook/waitlist-confirm
```

### Example prompts that work well

In Claude Code with ElevenLabs MCP active:
```
"Using the elevenlabs MCP, create a voice agent that confirms
Elote King event waitlist signups. The agent should be warm but brief —
under 90 seconds per call. Save the agent ID to a file called
elevenlabs-agent-config.json"
```

```
"Generate a 30-second voiceover announcement using voice ID [id] that says:
'Event #2 is officially on. February 27th, Alpharetta. Halal Mexican street food
you won't find anywhere else in Atlanta. Waitlist is live — link in bio.'
Output as MP3."
```

### Failure modes

**"Call failed — no answer"**
- Fix: Build a retry logic. Wait 2 hours, try once more. Then fall back to SMS. Do not call more than twice.
- Detection: Check ElevenLabs webhook for `call_status: failed`

**"Phone number not verified"**
- Fix: ElevenLabs requires phone number verification. Go to Conversational AI → Phone Numbers and verify the number before going live.

**"Agent sounds robotic / reads too fast"**
- Fix: In ElevenLabs, set Stability to 0.5 and Similarity Boost to 0.75. Add pauses with `<break time="0.5s"/>` tags in the script.

**"Calls go to voicemail"**
- Fix: Add voicemail detection. In agent settings, set Voicemail Detection to ON. Configure a separate voicemail script: shorter, leaves a callback number.

**n8n webhook doesn't fire from Formspree**
- Fix: Formspree free tier does not support webhooks. You need Formspree Basic ($8/mo) or switch to a Google Apps Script form handler that calls n8n directly.

### Cost at scale

ElevenLabs pricing (as of Feb 2026):
- Starter: $5/mo for 30,000 characters TTS
- Creator: $22/mo for 100,000 characters
- Pro: $99/mo for 500,000 characters + Conversational AI (2,000 minutes/mo)
- Business: Custom pricing

Conversational AI (phone calls): ~$0.08-$0.15 per minute depending on plan

| Volume | Avg call duration | Monthly cost |
|--------|------------------|-------------|
| 100 calls | 90 seconds avg | ~$12-$22 |
| 1,000 calls | 90 seconds avg | ~$120-$225 |
| 10,000 calls | 90 seconds avg | ~$1,200-$2,250 + custom plan |

At 1,000 calls/month you need Business tier — contact sales. Realistically for event waitlists, you're running 100-500 calls per event cycle.

**Time savings:** Manual confirmation calls take 3-5 minutes each. At 200 signups, that's 10-17 hours of phone time. The agent does it in 30 minutes of compute time, zero human hours.

---

## 1.3 Workflow: Branded Voice Content for Social Media

### What it does
Turn written content (menus, event announcements, hype copy) into polished voiceovers for Reels, TikToks, and YouTube Shorts — all in your brand voice.

### Example prompts

```
"Using elevenlabs MCP text_to_speech with voice ID [brand_voice_id],
generate a 15-second Instagram Reel voiceover from this script:
'Atlanta, pay attention. Event #2 is dropping February 27th.
Halal Mexican street food. King Smash Burgers. Mango Loca.
Gold Flan Royale. Fifty spots. First come, first served.
Link in bio before it's gone.'
Output as MP3 to /public/audio/event2-reel-vo.mp3"
```

```
"Generate five different 10-second voiceover variations for
this menu item description: 'King Smash Burger — halal beef smashed
thin on a flat top, stacked double, draped in our secret Elote sauce.'
Use voice ID [id] with high energy delivery. Number them 1-5
so I can pick the best one."
```

### Batch generation workflow

For content pipelines, batch processing saves time:

```bash
# Create a JSON file with your content list
# content-batch.json:
[
  {"id": "event2-hero", "text": "Event #2 is live...", "voice": "brand_voice_id"},
  {"id": "menu-burger", "text": "King Smash Burger...", "voice": "brand_voice_id"},
  {"id": "menu-taquito", "text": "Taquito Michelada...", "voice": "brand_voice_id"}
]
```

Then in Claude Code:
```
"Read content-batch.json, then use elevenlabs MCP to generate
each voiceover as an MP3. Save to /public/audio/[id].mp3.
Process them in sequence, wait 2 seconds between requests to avoid rate limits.
Report which ones succeeded and which failed."
```

---

## 1.4 Workflow: Voice Cloning for Consistent Brand Narration

This creates a digital version of your voice that can generate unlimited content.

### Step 1: Record voice samples

ElevenLabs needs 1-30 minutes of clean audio. For best results:
- Record at least 5 minutes of varied speech
- No background noise, no music
- Include a mix of: normal speech, excited speech, questions, calls to action
- Use a decent USB mic or your phone in a quiet room with soft surfaces
- Save as MP3 or WAV at 44.1kHz or higher

Sample script to record:
```
"Welcome to Elote King Atlanta. I'm Fahim and I want to tell you
about what we're building here. This is halal Mexican street food
done right. 100% Zabiha halal. Muslim-owned. Zero alcohol.
And the food? The food hits different. King Smash Burger.
Taquito Michelada — first in Atlanta. Chorizo Drip Fries.
You haven't had anything like this.

Event #1 sold out in 48 hours. That was with zero paid ads.
Zero. Just word of mouth and people who showed up and couldn't
stop talking about it. That's what we're building.

Event #2 is coming. February 27th. Alpharetta. Fifty spots.
If you're on the waitlist, you get first access.
If you're not on the list, you're gambling.
The link is in the bio. Let's go."
```

Record this 3-4 times with slightly different energy. Upload all recordings.

### Step 2: Clone in ElevenLabs

```
elevenlabs.io → Voices → Add Voice → Instant Voice Clone
→ Upload your recordings
→ Name it: "Fahim — Brand Voice"
→ Add labels: energetic, authoritative, conversational
→ Click Add Voice
→ Copy the Voice ID
```

Professional Voice Clone (higher quality, requires more samples):
```
Voices → Add Voice → Professional Voice Clone (requires 30+ minutes of audio)
→ Submit → ElevenLabs trains it in 24-48 hours
```

### Step 3: Use the voice in Claude Code

```
"Using elevenlabs MCP, generate a 60-second brand intro voiceover
using voice ID [your_cloned_voice_id] with these settings:
stability 0.5, similarity_boost 0.8, style 0.3.
Script: [your script here]
Save the output to /public/audio/brand-intro.mp3"
```

### Failure modes for voice cloning

**"Voice doesn't sound like me"**
- Fix: Record more samples. 1 minute is not enough. Record 10+ minutes with emotional variety. The Pro Clone product is significantly better than Instant Clone.

**"Voice sounds inconsistent across generations"**
- Fix: Lock stability higher (0.65+). Lower stability = more expression but less consistency. For brand narration, prioritize consistency over dynamism.

**"ElevenLabs keeps failing with 429 errors"**
- Fix: You're hitting rate limits. Add a 3-second delay between generations. For batch work, run at off-peak hours (early morning US time).

---

# 2. Playwright MCP — Browser Automation

**Status:** Official production MCP from Microsoft
**Repo:** github.com/microsoft/playwright-mcp
**Why it matters:** Claude can control a real browser — navigate pages, click buttons, fill forms, take screenshots, extract data. No API required for the target site.

---

## 2.1 Windows 11 Setup

### Prerequisites
- Node.js 18+ installed
- Claude Code installed

### Step 1: Install the MCP

```bash
claude mcp add playwright -- npx @playwright/mcp@latest
```

That's it. Playwright MCP installs its own browser (Chromium) as part of the npm package.

### Step 2: Verify

```bash
claude mcp list
# Should show: playwright
```

### Step 3: (Optional) For visible browser mode

By default, Playwright runs headless (no visible window). To see what Claude is doing:

```bash
# Create a config file: playwright-mcp.config.json
{
  "headless": false,
  "viewport": {"width": 1280, "height": 720}
}

# Add with config
claude mcp add playwright -- npx @playwright/mcp@latest --config ./playwright-mcp.config.json
```

Headless = false is useful for debugging. Switch to headless = true for production.

### Alternative: browser-use (Python, for complex workflows)

If you need more AI-native browser control, browser-use converts the entire DOM to AI-readable text, which is more reliable for complex pages than raw Playwright.

```bash
# Requires Python 3.11+
pip install browser-use playwright
playwright install chromium

# Example usage
python -c "
from browser_use import Agent
import asyncio

async def main():
    agent = Agent(
        task='Go to Instagram.com/elotekingatlanta and get the follower count',
        llm='claude-sonnet-4-6'  # uses Claude under the hood
    )
    result = await agent.run()
    print(result)

asyncio.run(main())
"
```

---

## 2.2 Workflow: Automated Social Media Posting

**Decision made:** This covers Instagram, which is the hardest platform. Meta's API does not allow personal posting — only Business API. Direct browser automation is the practical path for posting to personal/creator accounts.

### What it does
Takes a caption + image path and posts to Instagram automatically. Saves 5-10 minutes per post, enables scheduling, removes the need to be at your phone.

### Reality check on Instagram automation
Instagram actively detects automation. Use these rules:
- Always use headless: false and slow down actions (add delays)
- Never post more than 5 times in 24 hours from an automated script
- Use a residential proxy if posting at scale
- Log in from the same IP every time — Instagram flags IP changes
- Cookie persistence is mandatory (explained below)

### Step 1: Session login (do this once)

```
"Using playwright MCP, open a non-headless browser, navigate to
instagram.com, and wait for me to manually log in.
Once I confirm I'm logged in, save the browser session cookies
to a file called instagram-session.json"
```

Manual login + 2FA → Claude saves the session. Now you don't need to log in again.

### Step 2: Post using saved session

```
"Using playwright MCP:
1. Load the saved session from instagram-session.json
2. Navigate to instagram.com — verify I'm still logged in by checking
   for the home feed
3. Click the + (New Post) button
4. Upload the image at /ad-creatives/event2-card-01.jpg
5. Click Next, then Next again
6. Paste this caption exactly:
   'Event #2 is locked in. Feb 27 Alpharetta.
   Halal Mexican street food — the only tasting like this in Atlanta.
   50 spots. Link in bio for waitlist access.
   #HalalFood #AtlantaFood #EloteKing #HalalAtlanta'
7. Click Share
8. Take a screenshot of the confirmation and save to /screenshots/ig-post-confirm.png"
```

### Step 3: Build a posting schedule

Create a file `social-queue.json`:
```json
[
  {
    "platform": "instagram",
    "image": "/ad-creatives/event2-card-01.jpg",
    "caption": "Event #2 drops Feb 27...",
    "post_time": "2026-02-22T18:00:00",
    "status": "pending"
  },
  {
    "platform": "instagram",
    "image": "/ad-creatives/event2-card-02.jpg",
    "caption": "King Smash Burger...",
    "post_time": "2026-02-23T12:00:00",
    "status": "pending"
  }
]
```

Then run via n8n on a schedule:
```
n8n schedule trigger → HTTP request to run playwright script → update social-queue.json status
```

### Failure modes

**"Login session expired"**
- Fix: Instagram sessions expire after 30-60 days of inactivity, or if you log in from a different device/IP. Re-run Step 1 to refresh the session. Set a calendar reminder monthly.

**"Instagram shows CAPTCHA during automation"**
- Fix: Slow down all actions. Add `await page.waitForTimeout(2000)` between every click. Use residential proxies. If CAPTCHA persists, you've been flagged — rest the account for 24 hours.

**"Post fails silently — no error, no post"**
- Fix: Instagram's UI changes frequently. Playwright may click the wrong button. Take screenshots at each step to debug. Specify element selectors by aria-label not by class names (Instagram's classes are hashed and change often).

**"Playwright times out on slow Instagram loads"**
- Fix: Add explicit wait conditions. Instead of `click()` immediately, use `waitForSelector('[aria-label="New Post"]')` before clicking.

---

## 2.3 Workflow: Competitor Monitoring and Price Scraping

### What it does
Monitors competitor catering/event companies in Atlanta, tracks their pricing pages, event announcements, and Instagram activity. Delivers a weekly report.

### Setup

Create `competitor-list.json`:
```json
[
  {
    "name": "Competitor A",
    "website": "https://competitora.com/catering",
    "instagram": "https://instagram.com/competitora",
    "track": ["pricing", "events", "new menu items"]
  }
]
```

### Weekly monitoring prompt

```
"Using playwright MCP, run a competitor audit:

1. For each competitor in competitor-list.json:
   a. Navigate to their website pricing page
   b. Extract all pricing information (packages, per-person costs, minimums)
   c. Screenshot the page and save to /competitor-data/[name]-[date].png
   d. Navigate to their Instagram profile
   e. Extract the last 5 post captions and engagement counts
   f. Note any event announcements

2. Compare to last week's data in /competitor-data/last-week.json

3. Write a summary report to /competitor-data/weekly-report-[date].md with:
   - Any price changes
   - New events they announced
   - Content that got high engagement (so we can learn from it)
   - Anything they're doing that we should watch"
```

### Scheduling via n8n

```
TRIGGER: Schedule — Every Monday 8am
STEP 1: Run playwright script (via subprocess node or HTTP trigger)
STEP 2: Read the generated report file
STEP 3: Email report to Fahim
STEP 4: Store in Google Sheets for trend tracking
```

### Failure modes

**"Site blocks automated access"**
- Fix: Some sites use Cloudflare bot protection. Options: (1) Add realistic User-Agent headers, (2) Use BrowserMCP.io which routes through your real Chrome profile, (3) Accept that this specific site isn't scrapable and monitor it manually.

**"Prices are in images, not text"**
- Fix: Use Claude's vision. After screenshotting, pass the screenshot to Claude with: "Extract all pricing information visible in this screenshot." Claude can read prices from images.

**"Instagram doesn't load profile data without login"**
- Fix: Use the logged-in session from Workflow 2.2. Instagram shows follower counts and post previews when logged in. With session: navigate directly to the profile URL.

---

## 2.4 Workflow: Automated Form Filling and Data Entry

### What it does
Fills out vendor applications, event registration forms, permit applications, and business directory listings automatically.

### Example: Submit to Atlanta event directories

```
"Using playwright MCP, submit Elote King Atlanta to the following
event directories. Use this information for all forms:

Business Name: Elote King Atlanta
Category: Catering / Food Truck / Halal Food
Description: Atlanta's only halal Mexican street food experience.
Muslim-owned. 100% Zabiha halal. Zero alcohol. Available for
private events, corporate catering, and pop-up experiences.
Website: elotekingevents.com
Phone: [phone]
Email: [email]
Service Area: Metro Atlanta, Alpharetta, Roswell, Sandy Springs

Directories to submit to:
1. [URL 1]
2. [URL 2]
3. [URL 3]

After each submission, screenshot the confirmation and save to
/submissions/[directory-name]-confirm.png"
```

### Failure modes

**"Form has CAPTCHA"**
- Fix: Stop and flag it. Do not attempt to bypass CAPTCHAs — it violates most sites' TOS. Handle these manually or use a CAPTCHA-solving service (2captcha.com, $1/1000 solves) if the site permits it.

**"Required fields not recognized"**
- Fix: Some forms use custom dropdown menus, date pickers, or multi-step flows. Tell Claude to take a screenshot before filling and describe what it sees so it can plan the interaction.

---

## 2.5 Workflow: Screenshot-Based Visual QA Testing

### What it does
Tests the elotekingevents.com landing page across viewport sizes, checks for broken images, text overflow, mobile layout issues, and form functionality.

### Full QA test prompt

```
"Using playwright MCP, run a visual QA test on https://elotekingevents.com

Test the following viewports and take a full-page screenshot at each:
- 375x812 (iPhone 14)
- 390x844 (iPhone 14 Pro)
- 768x1024 (iPad)
- 1440x900 (Desktop)

Save screenshots to /qa-screenshots/[viewport-date].png

For each viewport, check and report:
1. Logo loads and is visible
2. Hero image loads (not broken)
3. All 6 food images load
4. Video player appears (don't need to play it)
5. Sticky bottom bar is visible
6. Waitlist form inputs are visible
7. No text is cut off or overflowing
8. Green 'Get Early Access' button is visible without scrolling on mobile

After all screenshots, submit the form with test data:
- Email: qa-test@test.com
- Phone: 404-000-0000

Verify the success message appears.

Output a QA report to /qa-screenshots/report-[date].md
listing PASS or FAIL for each check."
```

### Schedule this before every event push

Run this test every time you make code changes, and automatically 48 hours before ticket drop.

### Cost estimate for browser automation

Playwright MCP is free — it runs locally on your machine. The only cost is compute time.

- Social post: ~2-3 minutes of automation time
- Competitor audit (10 sites): ~15-20 minutes
- QA test (4 viewports): ~5-8 minutes

If you move to cloud browsers (Browserbase):
- Browserbase pricing: ~$0.006 per session minute
- 100 sessions/month at 5 min avg = ~$3/month

**Time savings:** Visual QA manually takes 30-45 minutes per test. Automated = 8 minutes unattended.

---

# 3. DaVinci Resolve MCP — Video

**Status:** Community-built, active maintenance
**Repo:** github.com/samuelgursky/davinci-resolve-mcp
**Why it matters:** Claude can edit video timelines, apply color grades, export clips, and run Python scripts inside Resolve — all without touching the GUI.

---

## 3.1 Windows 11 Setup

### Prerequisites
- DaVinci Resolve Studio installed (free version has Python API limitations; Studio is $295 one-time)
- Python 3.10 or 3.11 installed (NOT 3.12 — Resolve's Python bridge has compatibility issues with 3.12)
- Claude Code installed

### Step 1: Install DaVinci Resolve

```
blackmagicdesign.com/products/davinciresolve → Download → Windows
```

Install with default settings. Open Resolve and complete initial setup.

### Step 2: Enable Resolve scripting

In DaVinci Resolve:
```
Preferences → System → General → Enable Scripting
→ Set External scripting: Local
→ OK → Restart Resolve
```

### Step 3: Verify Python can talk to Resolve

Open a Python terminal:
```python
import sys
sys.path.append("C:/ProgramData/Blackmagic Design/DaVinci Resolve/Support/Developer/Scripting/Modules")
import DaVinciResolveScript as dvr_script
resolve = dvr_script.scriptapp("Resolve")
print(resolve.GetCurrentPage())  # Should print: media, cut, edit, fusion, color, fairlight, or deliver
```

If this works, Python-to-Resolve bridge is live.

### Step 4: Clone and install the MCP

```bash
git clone https://github.com/samuelgursky/davinci-resolve-mcp.git
cd davinci-resolve-mcp
pip install -r requirements.txt
```

### Step 5: Add to Claude Code

```bash
# Windows path — adjust if you cloned elsewhere
claude mcp add davinci-resolve -- python "C:/Users/dangr/davinci-resolve-mcp/server.py"
```

### Step 6: Verify — DaVinci Resolve must be open

The MCP only works while Resolve is running. This is a hard requirement — Resolve's Python API only accepts connections from external scripts while the application is active.

```bash
# With Resolve open:
claude mcp list
# Run a test in Claude Code:
# "Using davinci-resolve MCP, what is the current project name?"
```

---

## 3.2 Workflow: Batch Process Event Footage into Social Clips

### What it does
Takes raw event footage, cuts it into platform-optimized clips (Reels, TikToks, YouTube Shorts), and exports them in the correct format for each platform.

### Setup: Project structure in Resolve

Before running automation, create this structure in Resolve:
```
Project: Elote King Event #2
  Media Pool:
    Bin: Raw Footage
    Bin: Exports
      Subfolder: Instagram Reels
      Subfolder: TikTok
      Subfolder: YouTube Shorts
  Timelines:
    Event2-FullEdit
    Event2-Reels (created by automation)
    Event2-TikTok (created by automation)
```

### Clip cutting prompt

```
"Using davinci-resolve MCP, in the project 'Elote King Event #2':

1. Look at the timeline 'Event2-FullEdit'
2. Find all clips that are between 10-30 seconds long
3. For each found clip, create a new timeline called 'Reel-[clip-number]'
   that is exactly 1080x1920 (vertical, 9:16)
4. Add the clip to this new timeline, centered and cropped to fill the frame
5. Set timeline frame rate to 30fps
6. Export each Reel timeline to /exports/reels/ as H.264 MP4 at:
   - Resolution: 1080x1920
   - Bitrate: 8 Mbps
   - Audio: AAC 320kbps
7. Report which exports succeeded and their file sizes"
```

### Platform-specific export settings

| Platform | Resolution | Aspect | Max Duration | Bitrate |
|----------|-----------|--------|-------------|---------|
| Instagram Reels | 1080x1920 | 9:16 | 90 seconds | 8 Mbps |
| TikTok | 1080x1920 | 9:16 | 3 minutes | 8 Mbps |
| YouTube Shorts | 1080x1920 | 9:16 | 60 seconds | 8 Mbps |
| Instagram Feed | 1080x1350 | 4:5 | 60 seconds | 6 Mbps |
| Facebook | 1920x1080 | 16:9 | 240 minutes | 8 Mbps |

```
"Using davinci-resolve MCP, export the timeline 'Event2-Hero60sec'
in four formats simultaneously using Resolve's render queue:

Format 1 — Instagram Reels:
  Resolution: 1080x1920, Codec: H.264, Bitrate: 8000k
  Output: /exports/event2-hero-reels.mp4

Format 2 — TikTok:
  Resolution: 1080x1920, Codec: H.264, Bitrate: 8000k
  Output: /exports/event2-hero-tiktok.mp4

Format 3 — YouTube Shorts:
  Resolution: 1080x1920, Codec: H.264, Bitrate: 8000k
  Output: /exports/event2-hero-yt-shorts.mp4

Format 4 — Master (archive):
  Resolution: 1920x1080, Codec: H.265, Bitrate: 50000k
  Output: /exports/event2-hero-master.mp4

Add all four to render queue and start rendering."
```

---

## 3.3 Workflow: Auto-Add Subtitles/Captions to Videos

### What it does
Transcribes the audio in your video, generates subtitles, styles them to match your brand, and burns them into the video — ready for silent-scroll social media.

### Step 1: Generate subtitles via ElevenLabs STT + DaVinci

```
"Using elevenlabs MCP, transcribe the audio from
/public/video/EloteKing_HeroReel_LandingPage.mp4
Output as SRT format to /exports/subtitles/hero-reel.srt"
```

### Step 2: Apply subtitles in Resolve

```
"Using davinci-resolve MCP:
1. Open project 'Elote King Event #2'
2. Open timeline 'Event2-HeroReel'
3. Import the subtitle file /exports/subtitles/hero-reel.srt
   into the subtitle track
4. Apply these subtitle styles to all subtitle events:
   - Font: Arial Bold (or closest available)
   - Font size: 72px
   - Color: White (#FFFFFF)
   - Outline: Black, 3px
   - Position: Bottom center, 150px from bottom
   - Background: Semi-transparent black, 80% opacity
5. Preview the subtitles to verify they are readable
6. Export the timeline with burned-in subtitles as:
   /exports/event2-hero-captioned.mp4
   Same specs as social export above"
```

### Brand subtitle style for Elote King

For brand consistency, save this as a Resolve subtitle preset:
```
Font: Bebas Neue (matches brand — must be installed on system)
Size: 80px
Color: White
Outline: Black, 4px
Letter spacing: 2px
Position: Lower third, centered
```

---

## 3.4 Workflow: Branded Templates and Batch Apply

### What it does
Creates a master template with intro, outro, lower thirds, and color grade — then applies it to every new clip automatically.

### Step 1: Build the master template timeline

Build manually in Resolve once:
```
Template timeline: EloteKingTemplate_V1
  Track 1: [PLACEHOLDER] video clip goes here
  Track 2: Intro bumper (Elote King logo animation, 2 seconds)
  Track 3: Outro (website + social handles, 3 seconds)
  Track 4: Lower third — "Event #2 | Feb 27 | Alpharetta"
  Color grade: Applied to track 1 — warm tones, slightly punchy
```

### Step 2: Apply template to new clips via prompt

```
"Using davinci-resolve MCP, apply the EloteKingTemplate_V1 to
each video clip in the Media Pool bin 'Raw Footage - Event2':

For each clip:
1. Duplicate the template timeline, name it 'Event2-[ClipName]-Branded'
2. Replace the placeholder track with this clip
3. Adjust the lower third text to match the clip content:
   - Food close-ups: 'Event #2 | Feb 27 | Alpharetta'
   - Crowd shots: 'Event #2 | Elote King Atlanta'
   - Food prep: 'Halal Mexican Street Food | Elote King'
4. Render and export each branded clip to /exports/branded/

Report total clips processed and any failures."
```

---

## 3.5 Failure Modes for DaVinci Resolve MCP

**"Resolve API not responding"**
- Fix: Resolve must be open AND on the Edit page (not just the landing page). The API handshake only works when a project is loaded and the Edit or Color page is active.

**"Python 3.12 incompatibility error"**
- Fix: Downgrade to Python 3.10.x. Resolve's embedded Python uses 3.10 API. Check with `python --version`. Use pyenv or the Windows Python installer to install 3.10 alongside your existing version.

**"Export fails with codec error"**
- Fix: H.264 export requires the paid DaVinci Resolve Studio. Free version exports in H.265 only (or uncompressed). If you're on free, use H.265 or export ProRes if editing on Windows with appropriate codecs installed.

**"Resolve crashes when Claude runs a complex script"**
- Fix: DaVinci Resolve can be unstable with rapid-fire API calls. Add `time.sleep(0.5)` between operations in any Python script Claude generates. Never delete a clip that's currently playing or rendering.

**Time savings:** Manually cutting, color grading, adding subtitles, and exporting in 4 formats for one 30-second clip takes ~45-60 minutes. Automated = 5-10 minutes render time, 2 minutes setup.

**Cost:** DaVinci Resolve Studio is $295 one-time. No subscription. No per-export cost.

---

# 4. Anthropic Computer Use — Desktop Control

**Status:** Official Anthropic API feature
**Docs:** platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool
**Available on:** Claude Opus 4.6, Claude Sonnet 4.6
**Why it matters:** Claude sees a screenshot of your screen, moves the mouse, clicks buttons, types text, and reads what appears — exactly like a human operator sitting at your computer.

---

## 4.1 Full Setup

### How Computer Use works

Computer Use is an API feature, not an MCP. You call the Claude API with the `computer` tool enabled. Claude receives screenshots, plans actions, and returns tool calls like `mouse_move`, `left_click`, `type`, `screenshot`.

The loop:
```
1. Take screenshot of screen
2. Send to Claude API with computer tool + your task
3. Claude returns: "click at coordinates (450, 320)"
4. Your code executes the click
5. Take new screenshot
6. Send back to Claude
7. Repeat until task is complete
```

### Option A: Use the Computer Use OOTB framework (easiest)

This is the ShowLab framework that wraps the raw API into a ready-to-run tool. No Docker required (unlike Anthropic's official demo container).

```bash
# Prerequisites: Python 3.11+, git
git clone https://github.com/showlab/computer_use_ootb.git
cd computer_use_ootb
pip install -r requirements.txt

# Set your API key
export ANTHROPIC_API_KEY="sk-ant-your-key-here"

# Launch
python run.py
```

This opens a Gradio web UI at http://localhost:7860. You type a task in plain English, and Claude starts controlling your computer.

### Option B: Use it directly via API (for custom workflows)

```python
import anthropic
import base64
import subprocess
from PIL import ImageGrab  # pip install Pillow

client = anthropic.Anthropic()

def take_screenshot():
    """Take screenshot and encode as base64"""
    screenshot = ImageGrab.grab()
    screenshot.save("current_screen.png")
    with open("current_screen.png", "rb") as f:
        return base64.standard_b64encode(f.read()).decode("utf-8")

def run_computer_use_task(task: str):
    """Main loop for computer use"""
    messages = []

    while True:
        # Get current screenshot
        screenshot_b64 = take_screenshot()

        # Add screenshot to messages
        messages.append({
            "role": "user",
            "content": [
                {
                    "type": "tool_result",
                    "tool_use_id": "init",
                    "content": [{"type": "image", "source": {"type": "base64", "media_type": "image/png", "data": screenshot_b64}}]
                }
            ]
        })

        # Call Claude
        response = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=4096,
            tools=[{
                "type": "computer_20241022",
                "name": "computer",
                "display_width_px": 1920,
                "display_height_px": 1080,
                "display_number": 1
            }],
            messages=messages,
            system=f"Complete this task on the computer: {task}"
        )

        # Execute tool calls
        for block in response.content:
            if block.type == "tool_use" and block.name == "computer":
                action = block.input["action"]
                if action == "screenshot":
                    pass  # handled at top of loop
                elif action == "left_click":
                    # Execute mouse click using pyautogui
                    import pyautogui
                    pyautogui.click(block.input["coordinate"][0], block.input["coordinate"][1])
                elif action == "type":
                    import pyautogui
                    pyautogui.write(block.input["text"], interval=0.05)
                # ... handle other actions

        if response.stop_reason == "end_turn":
            break

# Usage
run_computer_use_task("Open Microsoft Excel, create a new sheet with headers: Date, Revenue, Customers")
```

For production use, use pyautogui for mouse/keyboard control:
```bash
pip install pyautogui pillow anthropic
```

### API pricing for Computer Use

Computer Use uses vision tokens (screenshots) + regular output tokens. Each screenshot = ~700-1500 tokens depending on screen content.

Rough cost per task:
- Simple task (5-10 steps): ~$0.05-$0.15
- Medium task (20-40 steps): ~$0.25-$0.75
- Complex task (100+ steps): ~$1.00-$3.00+

At Claude Sonnet 4.6 pricing: $3/M input tokens, $15/M output tokens.

---

## 4.2 Workflow: Automate Repetitive Desktop Tasks

### Email processing (Gmail/Outlook)

```python
task = """
Open my Gmail in Chrome.
Go to the inbox.
For each unread email with subject containing 'waitlist' or 'event':
  1. Open the email
  2. Read the sender name and message
  3. Copy their name and email to a text file called /waitlist-inquiries.txt
  4. Mark as read
  5. Close email
Stop after 20 emails.
"""
run_computer_use_task(task)
```

### Spreadsheet data entry

```python
task = """
Open the file C:/Users/dangr/Projects/event-signups.xlsx in Excel.
Add the following data to the next empty rows:
Name, Email, Phone, Signup Date
John Smith, john@example.com, 404-555-1234, 2026-02-21
Sarah Jones, sarah@example.com, 678-555-5678, 2026-02-21
[... list of signups ...]
Save the file after entering all data.
"""
run_computer_use_task(task)
```

### File organization

```python
task = """
Open File Explorer.
Navigate to C:/Users/dangr/Downloads.
Move all .jpg and .png files downloaded in the last 7 days to
C:/Users/dangr/Projects/elote-king-events/ad-creatives/incoming.
Create the incoming folder if it doesn't exist.
After moving, tell me how many files were moved.
"""
run_computer_use_task(task)
```

---

## 4.3 Workflow: GUI Testing for Web Apps

### What it does
Tests your Astro landing page across different browsers and resolutions using real browser windows — not simulated ones.

```python
task = """
Open Chrome browser.
Navigate to https://elotekingevents.com.

Run this test checklist and note PASS or FAIL for each:
1. Page loads in under 3 seconds (watch the loading indicator)
2. Logo is visible in the header
3. Hero image loads (not broken)
4. The text 'Event #1 Sold Out' is visible
5. Click the 'Get Early Access' button — does the page scroll to the form?
6. Type a test email 'test@test.com' into the email field
7. Type a test phone '404-000-0000' into the phone field
8. Click 'Get Early Access' button in the form
9. Does a success message appear?
10. Scroll to the video section — does the video player appear?

After testing in Chrome, resize the window to 375px wide and repeat tests 1-9.
Save a text report of all results to C:/Users/dangr/qa-test-results.txt
"""
run_computer_use_task(task)
```

---

## 4.4 Workflow: Operate Software With No API

The most powerful use case — software that has no API or is too complex to automate otherwise.

### GoHighLevel bulk operations

```python
task = """
I have Chrome open with GoHighLevel logged in.
Go to the Contacts section.
Filter contacts by tag: 'event1-attended'.
Export the filtered contact list as CSV.
Save the CSV to C:/Users/dangr/Projects/contacts-event1-export.csv.
"""
run_computer_use_task(task)
```

### QuickBooks data extraction

```python
task = """
Open QuickBooks Desktop.
Go to Reports → Sales → Sales by Customer Detail.
Set date range: January 1, 2026 to February 21, 2026.
Export this report as Excel to C:/Users/dangr/Projects/sales-q1-2026.xlsx.
"""
run_computer_use_task(task)
```

---

## 4.5 Limitations and Failure Modes

**"Claude clicks the wrong button"**
- Fix: This happens when UI elements are close together or Claude misidentifies coordinates. Add explicit coordinate verification: "Before clicking, take a screenshot and confirm the button labeled 'Submit' is at the coordinates you're about to click."

**"Task gets stuck in a loop"**
- Fix: Set a maximum step count. In the API loop, add a counter that stops after 50 iterations and reports where it got stuck. Always test on non-production systems first.

**"Computer Use fails on high-DPI Windows displays"**
- Fix: Windows 11 with 150% or 200% display scaling confuses coordinate math. Set display scaling to 100% during Computer Use sessions, or divide all coordinates by your DPI scale factor. In the API call, set `display_width_px` and `display_height_px` to your actual physical resolution, not the logical resolution.

**"Application window isn't in focus"**
- Fix: Computer Use works best when the target application fills the screen. Maximize the window before handing control to Claude. Add this at the start of every task: "First, take a screenshot and confirm [application name] is visible and in focus. If not, open it."

**"Sensitive data appears in screenshots"**
- Fix: Computer Use sends screenshots to Anthropic's servers. Do not use Computer Use when sensitive data (banking, medical records, passwords) is visible on screen. Minimize or close sensitive windows before running tasks.

**"Task corrupts data (deleted wrong thing)"**
- Fix: Always work on copies of important files. For any task involving deletion or overwriting, add: "Before deleting or overwriting anything, confirm with me by describing what you're about to change." This adds a human approval step before irreversible actions.

### Safety considerations

- Computer Use requires `ANTHROPIC_API_KEY` — costs real money per task
- Each screenshot sent to Anthropic's servers — treat this as external data transmission
- Test destructive tasks in sandboxed environments first (VMs, test accounts)
- For any financial or CRM operations, add confirmation checkpoints
- Limit API usage to specific known tasks — do not give open-ended instructions to Computer Use agents

### Cost at realistic usage levels

| Task type | Avg steps | Cost per task | Monthly (50 tasks) |
|-----------|----------|--------------|-------------------|
| Simple data entry | 15 steps | ~$0.08 | ~$4 |
| Email processing (20 emails) | 60 steps | ~$0.40 | ~$20 |
| Complex multi-app workflow | 150 steps | ~$1.20 | ~$60 |
| GUI testing (5 viewports) | 100 steps | ~$0.80 | ~$40 |

At realistic usage (50-100 tasks/month), budget $50-200/month for Computer Use.

**Time savings:** Data entry that takes 45 minutes manually = 5-10 minutes unattended. Email triage for 50 emails = 20 minutes → 2 minutes.

---

## Priority 2: Creative Tools

---

# 5. Blender MCP — 3D Modeling

**Status:** Community-built, most popular creative MCP (16k GitHub stars)
**Repo:** github.com/ahujasid/blender-mcp
**Why it matters:** 3D product mockups for packaging, animated logo intros for videos, social media 3D content.

---

## 5.1 Windows 11 Setup

### Step 1: Install Blender

```
blender.org → Download Blender 4.x → Windows Installer
```

Install with default settings. Blender is free.

### Step 2: Clone the Blender MCP

```bash
git clone https://github.com/ahujasid/blender-mcp.git
cd blender-mcp
pip install -r requirements.txt
```

### Step 3: Install the Blender addon

Inside Blender:
```
Edit → Preferences → Add-ons → Install
→ Navigate to: blender-mcp/addon.py
→ Install Add-on → Check the box to enable it
```

The addon starts a local socket server inside Blender on port 9876.

### Step 4: Add to Claude Code

```bash
# Blender must be open with the addon enabled
claude mcp add blender -- python "C:/path/to/blender-mcp/server.py"
```

### Step 5: Verify

In Claude Code with Blender open:
```
"Using blender MCP, what objects are currently in the scene?"
```

---

## 5.2 Workflow: 3D Product Mockups for Food Packaging

### Takeout container mockup

```
"Using blender MCP:
1. Clear the default scene
2. Create a takeout box shape — approximately 5 inches wide, 5 inches deep, 3 inches tall
   with a lift-off lid. Model it as a clean low-poly box.
3. Add a white material to the box
4. Create a flat label surface on the front face of the box
5. Apply a red/green color scheme on the label area matching:
   - Primary: #16a34a (green)
   - Accent: #dc2626 (red)
   - Background: white
6. Add the text 'ELOTE KING' on the label using Bebas Neue font style
7. Set up a 3-point lighting rig for product photography
8. Set camera to isometric view, frame the box filling 80% of the frame
9. Render at 1080x1080 (Instagram square) with 128 samples
10. Save render to C:/Users/dangr/Projects/elote-king-events/3d-renders/takeout-box-mockup.png"
```

### Animated logo intro for videos

```
"Using blender MCP:
1. Create a 3-second logo animation:
   a. Start with black background
   b. At frame 1: Elote King crown logo (simple crown shape — 5 points)
      appears as a flat 2D shape, colored gold (#F59E0B)
   c. Frames 1-30: Crown spins in from nothing (scale from 0 to 1, rotation 0-360)
   d. Frames 30-60: Text 'ELOTE KING' types on below the crown, white color
   e. Frames 60-75: Brief pause
   f. Frames 75-90: Fade to black
2. Set scene to 30fps, 90 frames total
3. Set render to 1080x1920 (vertical for Reels)
4. Render animation to C:/Users/dangr/Projects/elote-king-events/3d-renders/logo-intro/
   as PNG sequence (frames 0001-0090)
5. Report when complete"
```

Then convert the PNG sequence to video using FFmpeg or DaVinci Resolve.

---

## 5.3 Workflow: 3D Scenes for Social Media Content

### Food photography-style scene

```
"Using blender MCP:
1. Create a flat lay scene (camera looking straight down)
2. Add a wooden table surface (brown, slightly rough texture)
3. Place a round plate in the center (white ceramic material)
4. Add a simple burger shape on the plate (two stacked cylinders for patties,
   beveled square for bun top and bottom)
5. Scatter some cilantro sprigs around (simple green leaf shapes)
6. Add lime wedges on the side (green wedge shapes)
7. Set up warm, golden hour lighting (key light at 45 degrees,
   warm orange tint, fill light soft blue-white)
8. Camera: top-down orthographic view
9. Render at 1080x1080 with 256 samples
10. Save to 3d-renders/flatlay-burger.png"
```

### Failure modes

**"Blender crashes when Claude sends a complex command"**
- Fix: Blender is memory-intensive. Save your work before running automation. Reduce sample count for test renders (32 samples instead of 256). Close other applications.

**"Blender addon loses connection to MCP"**
- Fix: The socket connection drops if Blender loses focus for too long or runs a render. Re-enable the addon after each render: Blender Preferences → Add-ons → disable BlenderMCP → re-enable.

**"Renders look bad"**
- Fix: For good renders, enable Cycles renderer (not Eevee). In Claude's prompt, specify: "Use Cycles renderer, enable denoising." Eevee is faster but less photorealistic.

**Cost:** Blender is free. Rendering is CPU/GPU time on your machine. A 1080x1080 render at 128 samples takes 2-15 minutes on a mid-range GPU.

---

# 6. Ableton MCP — Music Production

**Status:** Community-built, 2.5M+ users
**Repo:** github.com/ahujasid/ableton-mcp
**Why it matters:** Create original background music for event videos, jingles for ads, and beats for social content — all from plain English prompts.

---

## 6.1 Windows 11 Setup

### Prerequisites
- Ableton Live 10, 11, or 12 installed (Suite or Standard recommended — Intro has instrument limits)
- Python 3.8+

### Step 1: Install ableton-mcp Python package

```bash
pip install ableton-mcp
```

### Step 2: Install the Ableton MIDI Remote Script

The MCP communicates with Ableton through a MIDI Remote Script (a Python file you drop into Ableton's MIDI Remote Scripts folder).

```bash
# Find where ableton-mcp installed its remote script
python -c "import ableton_mcp; import os; print(os.path.dirname(ableton_mcp.__file__))"
# Will output something like: C:/Users/dangr/AppData/Local/Programs/Python/Python311/Lib/site-packages/ableton_mcp
```

Copy the `AbletonMCP` folder from that location to:
```
C:/Users/[username]/Documents/Ableton/User Library/Remote Scripts/
```

### Step 3: Enable in Ableton

Open Ableton Live:
```
Options → Preferences → Link, Tempo & MIDI → MIDI Ports
→ Control Surface: AbletonMCP (should appear in dropdown)
→ Input: None
→ Output: None
→ Click OK
```

Ableton console (bottom of screen) should show: "AbletonMCP: Connected"

### Step 4: Add to Claude Code

```bash
claude mcp add ableton -- python -m ableton_mcp.server
```

### Step 5: Verify

In Claude Code with Ableton open:
```
"Using ableton MCP, what is the current BPM of the session?"
```

---

## 6.2 Workflow: Background Music for Event Videos

### 60-second background track for Reels/TikTok

```
"Using ableton MCP, create a 60-second background music track:

Vibe: Upbeat, modern, energy without being aggressive.
Think: restaurant ambience meets street food energy. Latin influence.

Steps:
1. Set BPM to 95
2. Create a drum track:
   - Load a Latin percussion kit (or the closest available)
   - Write a 4-bar loop: kick on 1 and 3, snare on 2 and 4,
     hi-hat on every 8th note, conga accents on beats 2 and 4
3. Create a bass track:
   - Load an electric bass or upright bass instrument
   - Write a simple 4-bar bass line in A minor: A-A-C-E pattern
4. Create a rhythm guitar track:
   - Load an acoustic or nylon string guitar
   - Write simple chord strums: Am-F-C-G progression
5. Create a melody track:
   - Load a marimba or xylophone instrument
   - Write an 8-bar melody in A minor, upbeat and catchy
6. Set loop length to 8 bars
7. Export the session to /public/audio/background-event2.wav at 44.1kHz 16-bit
Report when complete."
```

### Jingle for event announcements

```
"Using ableton MCP:
1. Set BPM to 120
2. Create a 5-second jingle (10 bars at this tempo, actually just 2.5 bars):
   - Chord hit on beat 1: bright, punchy (use a synth pad or piano)
   - Short ascending melody (4 notes, total 2 beats): C-E-G-C (major, triumphant)
   - Final long note holds 1.5 beats
3. This should sound like a brand signature — memorable, positive
4. Export as WAV to /public/audio/elote-king-jingle.wav"
```

### Failure modes

**"AbletonMCP doesn't appear in Control Surface dropdown"**
- Fix: The Remote Scripts folder must be exactly right. The folder must be named `AbletonMCP` (not `ableton_mcp` or `AbletonMcp`) and must be directly inside the Remote Scripts folder, not nested. Restart Ableton after copying.

**"Commands execute but nothing changes in Ableton"**
- Fix: The connection is established but commands aren't executing. Try: disable the AbletonMCP Control Surface in preferences, re-enable it, and then retry.

**"Exported audio has no sound"**
- Fix: Make sure all MIDI tracks are routed to audio outputs and instrument plugins are loaded. Ask Claude: "Check if all tracks have instruments loaded and are unmuted."

**"Can't load specific instruments"**
- Fix: The MCP can only load instruments you have installed in Ableton. Ableton Intro has very limited instruments. Suite has the full library. For missing instruments, use free Ableton packs or free VSTs.

**Cost:** Ableton Live costs $99-$799 depending on edition. ableton-mcp is free. No per-generation cost.

**Time savings:** Writing a 60-second background track from scratch takes a producer 2-4 hours. Claude does it in 5-10 minutes (plus render time). Quality won't match a professional, but for social media backgrounds it's sufficient.

---

## Priority 3: Infrastructure

---

# 7. Smithery Toolbox

**Status:** Production — officially maintained by Smithery
**URL:** smithery.ai
**Why it matters:** One MCP that dynamically routes to all 4,000+ MCPs. Install once, use everything.

---

## How It Works

Normally, adding MCPs is manual: install each one, configure API keys, restart Claude. Smithery Toolbox inverts this — Claude tells Smithery what tool it needs, Smithery spins it up dynamically, and routes the call.

### Install Smithery Toolbox

```bash
npx @smithery/cli install @smithery/toolbox --client claude
```

This adds a single MCP to Claude Code. That one MCP has access to Smithery's entire registry of 4,000+ servers.

### What it actually does

When you ask Claude: "Check the weather in Atlanta," instead of needing a weather MCP pre-installed, the Toolbox:
1. Identifies the task needs a weather tool
2. Queries Smithery for the best weather server
3. Calls that server dynamically
4. Returns the result

### When to use Toolbox vs. individual MCPs

**Use Toolbox for:**
- Experimenting with new tools you haven't installed
- Tasks that need rare or one-off tools
- When you want Claude to figure out which tool to use

**Use individual MCPs for:**
- Tools you use daily (ElevenLabs, Playwright, DaVinci)
- Tools that require persistent configuration (API keys, sessions)
- Production workflows where stability matters

**The practical limitation:** Smithery Toolbox spins up servers dynamically via HTTP. This means:
- Slightly slower than locally-installed MCPs (~200-500ms latency per tool call)
- Requires internet connection for every tool call
- You don't control which server version is running
- API keys for individual tools still need to be configured in Smithery's dashboard

### Performance overhead

Locally-installed MCP (stdio transport): ~10-50ms per tool call
Smithery Toolbox (HTTP routing): ~200-600ms per tool call

For interactive tasks, this is imperceptible. For high-frequency automation (1000+ tool calls), this adds up. Use individual MCPs for production automation.

### Cost

Smithery has a free tier. Heavy usage (high tool call volume) may require a paid plan — check smithery.ai/pricing for current tiers.

---

# 8. E2B Desktop Sandbox

**Status:** Production — $35M funded, Fortune 100 customers
**URL:** e2b.dev
**Why it matters:** A throwaway computer in the cloud. Claude gets a full desktop environment to operate in — completely isolated from your real machine.

---

## When to Use E2B vs Local Execution

| Scenario | Use E2B | Use Local |
|----------|---------|-----------|
| Running untrusted AI-generated code | Yes | Never |
| Testing a scraper that might get IP banned | Yes | No |
| Destructive operations (delete, overwrite) | Yes | Carefully |
| Needs persistent login sessions | No | Yes |
| Needs your local files | No | Yes |
| Long-running research agent | Yes | Risk |
| Production workflow (known, tested code) | No | Yes |
| Experimenting with a new automation | Yes | Risky |

### Setup

```bash
# Install E2B MCP
claude mcp add e2b -- npx -y @e2b/mcp-server

# Get API key from e2b.dev → Dashboard → API Keys
export E2B_API_KEY="e2b_your_key_here"
```

### Desktop Sandbox (full GUI desktop in cloud)

```python
from e2b_desktop import Sandbox

sandbox = Sandbox()

# Take a screenshot of the cloud desktop
screenshot = sandbox.screenshot()

# Type text in the sandbox
sandbox.write("Hello from Claude")

# Open a browser in the sandbox
sandbox.open("https://instagram.com")

# Run a command
sandbox.commands.run("python script.py")
```

### Real use case: Test automation before running locally

```
"Using e2b MCP, spin up a sandbox and:
1. Install playwright in the sandbox
2. Run this web scraping script [paste script]
3. Show me the output
4. If it works correctly, I'll run it locally

This tests the script without risking my IP being flagged or
any local side effects."
```

### Cost structure

E2B pricing (as of Feb 2026, estimated from published tiers):
- Free tier: 10 hours of sandbox time/month
- Hobby: $20/month for 50 hours
- Pro: $50/month for 200 hours + priority support
- Enterprise: Custom

Sandbox startup time: under 200ms. Sandbox lifetime: configurable, automatically cleaned up.

A typical automation session (scraping, testing, research): 15-30 minutes of sandbox time.

At Hobby tier ($20/month):
- 50 hours = 3,000 minutes
- At 20 minutes avg per session = 150 sessions/month
- That's plenty for development work

For production automation running 1,000 jobs/month each taking 5 minutes = 83 hours. Need Pro or Enterprise.

---

## Quick Reference: Tool Selection Matrix

| Task | Best Tool | Backup |
|------|----------|--------|
| Outbound phone calls | ElevenLabs MCP | n8n + Twilio |
| Generate voiceovers | ElevenLabs MCP | None |
| Clone your voice | ElevenLabs MCP | None |
| Post to Instagram | Playwright MCP | BrowserMCP.io |
| Scrape competitor sites | Playwright MCP + browser-use | Browserbase |
| Fill forms automatically | Playwright MCP | Computer Use |
| QA test websites | Playwright MCP | Computer Use |
| Cut event footage | DaVinci Resolve MCP | FFmpeg MCP |
| Add captions to video | ElevenLabs STT + DaVinci MCP | FFmpeg MCP |
| Create background music | Ableton MCP | Suno MCP |
| 3D product mockups | Blender MCP | None |
| Animated logo intros | Blender MCP | After Effects MCP |
| Operate any desktop software | Computer Use | None |
| Run risky code safely | E2B Sandbox | None |
| Access any MCP without pre-installing | Smithery Toolbox | Individual MCPs |

---

## Monthly Cost Summary at Realistic Usage

This is a solo operator running Elote King + Creative Labs, posting 5x/week, running 200-500 event waitlist calls/month.

| Tool | Usage level | Monthly cost |
|------|------------|-------------|
| ElevenLabs (voice + calls) | 300 calls + TTS | $99 (Pro) |
| Playwright MCP | Local runs | $0 |
| DaVinci Resolve Studio | One-time purchase | $0/mo after $295 |
| Computer Use API | 50 tasks/month | ~$30 |
| Blender | Open source | $0 |
| Ableton Live | License purchase | $0/mo after $99-$799 |
| Smithery Toolbox | Light usage | $0 (free tier) |
| E2B | Development/testing | $0-$20 |
| **Total ongoing** | | **~$130-$150/month** |

One-time setup costs: ~$400-$1,100 (DaVinci Studio + Ableton + hardware mic for voice clone)

**Revenue offset:** If ElevenLabs automated calls convert even 5% more waitlist signups into ticket buyers (conservative for event revenue), 300 calls → 15 extra buyers → at a $45 ticket = $675 revenue. Tool pays for itself in month 1.

---

## Final Installation Checklist

Run these commands in order to get the full stack operational:

```bash
# 1. ElevenLabs MCP (official)
export ELEVENLABS_API_KEY="sk_your_key"
claude mcp add elevenlabs -- npx -y @elevenlabs/elevenlabs-mcp

# 2. Playwright MCP (Microsoft, official)
claude mcp add playwright -- npx @playwright/mcp@latest

# 3. Smithery Toolbox (for everything else)
npx @smithery/cli install @smithery/toolbox --client claude

# 4. E2B (sandbox for risky code)
export E2B_API_KEY="e2b_your_key"
claude mcp add e2b -- npx -y @e2b/mcp-server

# 5. Verify all are installed
claude mcp list

# 6. DaVinci Resolve MCP (manual — see setup above)
# Requires DaVinci Resolve Studio + Python 3.10

# 7. Blender MCP (manual — see setup above)
# Requires Blender 4.x installed

# 8. Ableton MCP (manual — see setup above)
# pip install ableton-mcp
# Then install MIDI Remote Script in Ableton
```

Test after each installation. Don't install them all at once and debug a broken stack.
