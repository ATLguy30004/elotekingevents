# Claude Capabilities Research: MCP Servers, Agents, and Tools That Extend Claude Far Beyond Text

**Research Date:** February 21, 2026
**Protocol:** 5-Phase Deep Research Protocol
**Scope:** Browser automation, image gen, video editing, music/audio, 3D modeling, desktop control, design tools, code execution sandboxes, database/infrastructure, and wild cards

---

## PHASE 1 + 2: PEOPLE MAP

The builders behind the most impressive Claude-extending tools.

| # | Name | Handle | Company/Role | Key Products Built | What They're Known For |
|---|------|--------|-------------|-------------------|----------------------|
| 1 | Eduard Ruzga | @wonderwhy-er | Independent | Desktop Commander MCP | First solo dev to go viral with an MCP; built the most-installed terminal-control MCP for Claude |
| 2 | Paul Klein IV | — | Browserbase (CEO, 3x founder) | Browserbase infra, Stagehand SDK, Director | Sold previous company to Mux; raised $67.5M total for browser infra for AI agents |
| 3 | Anirudh Kamath | @kamath (GitHub) | Browserbase (lead engineer) | Stagehand AI browser automation SDK | Built Stagehand, the most downloaded AI browser framework (500k weekly downloads) |
| 4 | Vasek Mlejnsky | @mlejva (LinkedIn) | E2B (Co-founder/CEO) | E2B Sandbox, Desktop Sandbox, Code Interpreter | Built cloud microVM infrastructure powering Manus and 88% of Fortune 100 AI agents |
| 5 | Tomas Valenta | — | E2B (Co-founder/CTO) | E2B infrastructure | Co-built E2B; raised $35M total ($21M Series A led by Insight Partners) |
| 6 | Erik Bernhardsson | @erikbern | Modal Labs (Founder/CEO) | Modal serverless GPU platform | Former Spotify ML; built the go-to serverless GPU cloud for AI workloads; raised $80M |
| 7 | Siddharth Ahuja | @sidahuj | Independent / Visiting Faculty CIID | Blender MCP (16k stars), Ableton MCP (2.5M+ users) | Built two of the most viral creative-tool MCPs solo; speaks at AI Engineer conferences |
| 8 | Magnus Muller | — | Browser Use (Co-founder/CEO) | browser-use Python library (66k+ GitHub stars) | ETH Zurich grad; YC W25; raised $17M seed led by Felicis |
| 9 | Gregor Zunic | @gregpr07 | Browser Use (Co-founder) | browser-use Python library | Co-built browser-use in 5 weeks; now used by 20+ YC companies |
| 10 | Paul Copplestone | — | Supabase (Co-founder/CEO) | Supabase MCP, Supabase platform | Official Supabase MCP lets Claude manage Postgres databases and full project infra |
| 11 | Mikey Shulman | — | Suno (CEO) | Suno AI music platform ($150M ARR, 50M users) | Leading AI music generation; community has built Suno MCP integration |
| 12 | Justin P. Barnett | @JustinPBarnett | Independent | Unity MCP (4.1k stars) | Built MCP that lets Claude create entire Unity games from a single prompt |
| 13 | Henry Mao | @Calclavia | Smithery (Co-founder/CEO) | Smithery MCP registry (4k+ servers), previously Jenni AI ($7M ARR exit) | Built the #1 MCP registry from scratch in Dec 2024; backed by South Park Commons |
| 14 | Frank Fiegel | @punkpeye | Independent | punkpeye/awesome-mcp-servers (most-forked MCP list) | Maintains the most-referenced curated MCP server directory on GitHub |
| 15 | Wong2 | @wong2_x | Independent (Shanghai) | wong2/awesome-mcp-servers, CLI Inspector, Jina Reader MCP | Prolific MCP curator and builder; 209 repos; built CLI tool for testing MCP servers directly |
| 16 | Greg Isenberg | @gregisenberg | Late Checkout (CEO), ex-Reddit/TikTok advisor | Startup Ideas Podcast | Documented "vibe marketing" with MCP + Claude; published list of 23 MCP startup ideas |

---

## PHASE 2 CONTINUED: PRODUCT MAP

Organized by builder, not category.

### Eduard Ruzga (wonderwhy-er)
- **Desktop Commander MCP** — github.com/wonderwhy-er/DesktopCommanderMCP
  - Terminal control, file system search, diff editing, process management for Claude
  - Free/open source. Went viral on Hacker News and Product Hunt
  - Install: `npx -y @wonderwhy-er/desktop-commander@latest setup`
  - Why impressive: Claude can run any terminal command, search your entire file system with ripgrep, and edit files with surgical diffs — basically giving Claude Code full OS-level access

### Paul Klein IV + Anirudh Kamath (Browserbase)
- **Browserbase MCP** — github.com/browserbase/mcp-server-browserbase
  - Cloud-hosted headless browsers for AI agents; stealth mode, CAPTCHA handling, session recording, autoscaling
  - Pricing: pay-per-session (free tier available)
  - Install: `claude mcp add --transport http browserbase https://mcp.browserbase.com`
- **Stagehand** — github.com/browserbase/stagehand
  - Open-source AI browser automation SDK (Node.js + Python); 500k weekly downloads
  - Uses atomic primitives: act(), extract(), observe()
  - Free/open source, runs on Browserbase infrastructure or locally
- **Director** — browserbase.com
  - No-code version: describe what you want in English, get running browser automation
  - Launched with $40M Series B (June 2025)

### Magnus Muller + Gregor Zunic (Browser Use)
- **browser-use** — github.com/browser-use/browser-use
  - Python library that converts websites into AI-readable format; 66k+ GitHub stars
  - Works with Claude, GPT-4, Gemini
  - YC W25; raised $17M seed
  - Install: `pip install browser-use`
  - Why impressive: Converts entire browser UI into text Claude can understand; used by 20+ YC companies; most starred browser-agent framework on GitHub

### Vasek Mlejnsky + Tomas Valenta (E2B)
- **E2B Sandbox** — e2b.dev | github.com/e2b-dev/E2B
  - Secure cloud microVMs that spin up in under 200ms; runs AI-generated code safely
  - Supports Python, JavaScript, any language/framework
  - MCP server: github.com/e2b-dev/mcp-server
  - $35M total funding; used by Manus, Fortune 100 companies
  - Install: `claude mcp add e2b -- npx -y @e2b/mcp-server`
  - Why impressive: AI-generated code runs in disposable VMs, not your machine; E2B had desktop sandbox running 6 months BEFORE Anthropic launched Computer Use
- **E2B Desktop Sandbox** — Secure virtual computers in cloud for LLMs; full GUI desktop in a VM

### Erik Bernhardsson (Modal Labs)
- **Modal** — modal.com
  - Serverless GPU cloud; Python decorators turn local functions into cloud GPU jobs
  - Claude Skill available: modal-serverless-gpu
  - $80M raised (2025); Oracle Cloud infrastructure backing
  - Install skill: copy modal-serverless-gpu to ~/.claude/skills/
  - Why impressive: Claude can spin up a Stable Diffusion job, fine-tune a model, or run any GPU workload with a single Python decorator — zero DevOps

### Siddharth Ahuja (Independent)
- **Blender MCP** — github.com/ahujasid/blender-mcp | blender-mcp.com
  - Connects Claude to Blender via MCP socket; 16.3k GitHub stars, 1.5k forks
  - Create and modify 3D models, scenes, materials, lighting using natural language
  - MIT license, free
  - Install: `claude mcp add blender -- python /path/to/blender-mcp/server.py`
  - Why impressive: "Create a low-poly dragon guarding treasure" → full Blender scene in seconds. Spawned an entire category of creative-tool MCPs.
- **Ableton MCP** — github.com/ahujasid/ableton-mcp | ableton-mcp on PyPI
  - Connects Claude to Ableton Live via socket server
  - Creates tracks, loads instruments and effects, writes melodies, controls playback and tempo
  - "Create a Metro Boomin-style beat" → actual Ableton session
  - Install: `pip install ableton-mcp`, then install Ableton MIDI Remote Script
  - Why impressive: 2.5M+ users; Claude composes real music in a real DAW

### Justin P. Barnett (Independent)
- **Unity MCP** — github.com/justinpbarnett/unity-mcp (CoplayDev org)
  - Bridges Claude directly to Unity Editor; 4.1k stars
  - Manage assets, control scenes, edit scripts, automate tasks in Unity
  - Compatible with Claude Desktop, Claude Code, Cursor, VSCode
  - Install: Unity Package + MCP server config
  - Why impressive: Claude creates entire playable games from a single prompt

### Henry Mao (Smithery)
- **Smithery** — smithery.ai
  - #1 MCP registry; 4,000+ servers listed and hosted; 18k tool calls/day
  - **Smithery Toolbox** — single MCP that dynamically routes to all 4,000+ MCPs based on what your agent needs — no pre-configuration required
  - Backed by South Park Commons
  - Install any server: `npx @smithery/cli install <server-name>`

---

## PRODUCT MAP: BY CAPABILITY CATEGORY

### 1. BROWSER AUTOMATION

| Tool | Type | GitHub / URL | Install |
|------|------|-------------|---------|
| **Microsoft Playwright MCP** (official) | MCP server | github.com/microsoft/playwright-mcp | `claude mcp add playwright -- npx @playwright/mcp@latest` |
| **Puppeteer MCP** (official Anthropic) | MCP server | github.com/modelcontextprotocol/servers/tree/main/src/puppeteer | `claude mcp add puppeteer -- npx -y @modelcontextprotocol/server-puppeteer` |
| **BrowserMCP.io** | MCP + Chrome extension | browsermcp.io / github.com/BrowserMCP/mcp | Install Chrome extension, then `claude mcp add browsermcp` |
| **Browserbase MCP** | Cloud MCP | browserbase.com | `claude mcp add --transport http browserbase https://mcp.browserbase.com` |
| **Stagehand** | SDK (Node/Python) | github.com/browserbase/stagehand | `npm install @browserbasehq/stagehand` |
| **browser-use** | Python library | github.com/browser-use/browser-use | `pip install browser-use` |
| **Claude in Chrome** (official Anthropic) | Chrome extension | chrome.google.com + code.claude.com/docs/en/chrome | Install extension, paid Claude plan required |
| **ByteDance UI-TARS Browser MCP** | MCP server | github.com/bytedance/UI-TARS-desktop | Part of UI-TARS-desktop monorepo |
| **Dev Browser Skill** (SawyerHood) | Claude Skill | github.com/SawyerHood/dev-browser | Copy to ~/.claude/skills/ |

**Winner for most impressive:** browser-use for Python agents (66k stars, converts DOM to AI-readable text), Stagehand for production reliability, Claude in Chrome for zero-setup browser control in Claude Code.

**Warning:** Claude in Chrome extension went temporarily unavailable on Chrome Web Store as of February 5, 2026 — check current status.

---

### 2. IMAGE GENERATION

| Tool | Backend | GitHub / URL | Install |
|------|---------|-------------|---------|
| **Stability AI MCP** (tadasant) | Stable Diffusion | github.com/tadasant/mcp-server-stability-ai | `claude mcp add stability -- npx -y mcp-server-stability-ai` |
| **DALL-E MCP** (Garoth) | DALL-E 3 | github.com/Garoth/dalle-mcp | `claude mcp add dalle -- npx -y dalle-mcp` |
| **DALL-E Image Generator** (sammyl720) | DALL-E | PulseMCP: sammyl720-dall-e-image-generator | npm install + config |
| **fal.ai MCP** (raveenb) | 600+ models (Flux, etc.) | github.com/raveenb/fal-mcp-server | `pip install fal-mcp-server` |
| **FAL AI Image Generation** (sshtunnelvision) | fal-ai/recraft-v3 | PulseMCP: sshtunnelvision-fal-ai-image-generation | npm config |
| **FLUX Image Generator** (Black Forest Lab) | FLUX | PulseMCP: flux-image-generator | npm config |
| **Replicate/Flux MCP** (GongRzhe) | Replicate Flux | github.com/GongRzhe/Image-Generation-MCP-Server | `pip install` + Replicate API key |
| **mcp-image** (shinpr) | Gemini 3 Pro Image | github.com/shinpr/mcp-image | For Cursor, Codex |
| **Cloudflare Image Gen MCP** (janwilmake) | Cloudflare Workers AI | PulseMCP: janwilmake-image-generation-cloudflare | HTTP transport |

**Winner for most impressive:** fal.ai MCP (raveenb) — 600+ models including Flux, video generation, music, and audio all from one server. Most comprehensive single image/media generation MCP.

---

### 3. VIDEO EDITING

| Tool | Targets | GitHub / URL | Notes |
|------|---------|-------------|-------|
| **Adobe Premiere Pro MCP** (hetpatel-11) | Premiere Pro | github.com/hetpatel-11/Adobe_Premiere_Pro_MCP | Natural language timeline editing, media import, render |
| **DaVinci Resolve MCP** (samuelgursky) | DaVinci Resolve | github.com/samuelgursky/davinci-resolve-mcp | Project mgmt, timeline, media, Fusion comps, Python execution |
| **DaVinci Resolve MCP** (apvlv) | DaVinci Resolve + Fusion | github.com/apvlv/davinci-resolve-mcp | PulseMCP listed |
| **After Effects MCP** (Dakkshin) | After Effects | github.com/Dakkshin/after-effects-mcp | ExtendScript-based; keyframes, expressions, shapes, text |
| **Adobe Creative Suite MCP** (mikechambers) | PS + Premiere + AE | github.com/mikechambers/adb-mcp | Low-level ExtendScript API; "arbitrary extend script for complex operations" |
| **Video Editor MCP** (Kush36Agrawal) | FFmpeg | github.com/Kush36Agrawal/Video_Editor_MCP | Natural language → FFmpeg commands |
| **Video Audio MCP** (misbahsy) | FFmpeg | github.com/misbahsy/video-audio-mcp | Subtitles, audio, format conversion |
| **Premiere MCP** (toonyai) | Premiere Pro | LobeHub listing | Find video clips by speech, add to timeline |

**Winner for most impressive:** DaVinci Resolve MCP — requires DaVinci Resolve Studio but enables full project control including running arbitrary Python inside Resolve. After Effects MCP (Dakkshin) is the most polished for motion graphics.

---

### 4. MUSIC AND AUDIO

| Tool | Targets | GitHub / URL | Notes |
|------|---------|-------------|-------|
| **Ableton MCP** (ahujasid) | Ableton Live | github.com/ahujasid/ableton-mcp | 2.5M+ users; creates full tracks, loads instruments, sets BPM |
| **FL Studio MCP** (veenastudio) | FL Studio | PulseMCP: veenastudio-fl-studio; Smithery listing | Piano roll MIDI via virtual ports |
| **FL Studio MCP** (calvinw) | FL Studio piano roll | github.com/calvinw/fl-studio-mcp | Open source, built in 3 days |
| **ElevenLabs MCP** (official) | Text-to-Speech / STT | github.com/elevenlabs/elevenlabs-mcp | Voice cloning, TTS, STT, outbound voice agents |
| **ElevenLabs MCP** (mamertofabian) | ElevenLabs API | github.com/mamertofabian/elevenlabs-mcp-server | Community version |
| **Suno MCP** (MeroZemory) | Suno AI music | Glama: MeroZemory/suno-multi-mcp | Generate full songs with lyrics from prompts |
| **fal.ai MCP** (raveenb) | Audio + music generation | github.com/raveenb/fal-mcp-server | Includes audio/music via fal.ai models |

**Winner for most impressive:** Ableton MCP — Claude composes full tracks with instruments, effects, and arrangements in a real professional DAW. "Create a Metro Boomin-style beat" → actual playable session. ElevenLabs MCP is the best for voice/TTS work.

---

### 5. 3D MODELING

| Tool | Targets | GitHub / URL | Notes |
|------|---------|-------------|-------|
| **Blender MCP** (ahujasid) | Blender | github.com/ahujasid/blender-mcp | 16.3k stars; natural language → 3D scenes, models, materials |
| **Unity MCP** (justinpbarnett) | Unity Editor | github.com/justinpbarnett/unity-mcp (CoplayDev) | 4.1k stars; creates full games |
| **Unreal Engine + Blender MCP** (tahooki) | Unreal + Blender | github.com/tahooki/unreal-blender-mcp | Combo Unreal/Blender agent |

**Winner for most impressive:** Blender MCP — spawned an entire category. 16k stars. Went from concept tweet to viral in days.

---

### 6. DESKTOP AND OS CONTROL

| Tool | Approach | GitHub / URL | Notes |
|------|---------|-------------|-------|
| **Claude Computer Use** (official Anthropic) | Screenshots + actions via API | platform.claude.com/docs | Claude sees screenshots, moves cursor, clicks, types; available on Opus 4.6, Sonnet 4.6 |
| **Desktop Commander MCP** (wonderwhy-er) | Terminal + file system | github.com/wonderwhy-er/DesktopCommanderMCP | Most-installed MCP for OS control; terminal + file editing |
| **Computer Use OOTB** (ShowLab / Siyuan Hu) | Gradio UI + Computer Use API | github.com/showlab/computer_use_ootb | Cross-platform (Win + Mac); no Docker; research paper + framework |
| **E2B Desktop Sandbox** | Cloud VM GUI | e2b.dev | Full desktop in disposable cloud VM; safer than local computer use |
| **Firefox Browser Control MCP** (eyalzh) | Firefox extension + MCP | mcpservers.org: eyalzh/browser-control-mcp | Firefox-specific; MCP + browser extension pairing |
| **Claude Flow** (ruvnet) | Multi-agent swarm orchestration | github.com/ruvnet/claude-flow | Ranked #1 agent orchestration for Claude; deploys swarms, RAG, MCP |

**Winner for most impressive:** Claude Computer Use API — literally lets Claude see your screen and control your computer like a human. OOTB framework makes it plug-and-play without Docker.

---

### 7. DESIGN TOOLS

| Tool | Targets | GitHub / URL | Notes |
|------|---------|-------------|-------|
| **Figma MCP** (official Figma) | Figma Design | developers.figma.com | `claude mcp add --transport http figma https://mcp.figma.com/mcp` — read design structure, generate code from frames |
| **Figma → Code** (Claude Code integration) | Figma + Claude Code | figma.com/blog/introducing-claude-code-to-figma/ | Turn production UI back into editable Figma frames |
| **claude-talk-to-figma-mcp** (arinspunk) | Figma (read + modify) | github.com/arinspunk/claude-talk-to-figma-mcp | Community version; more advanced modification than official |
| **Canva MCP** (official Canva) | Canva AI Connector | canva.com/ai-connector/ | `claude mcp add canva`; generate designs, autofill templates, export PDF/images |
| **Miro MCP** (official Miro) | Miro whiteboards | developers.miro.com | `claude mcp add --transport http miro https://mcp.miro.com` |
| **FigJam integration** (Claude + Figma) | FigJam diagrams | figma.com | Claude generates flowcharts, Gantt charts in FigJam |
| **Magic UI MCP** | React component library | github.com/magicuidesign/mcp | Generates production-ready shadcn/Tailwind components |
| **Adobe Creative Suite MCP** (mikechambers) | Photoshop + Premiere + AE | github.com/mikechambers/adb-mcp | ExtendScript-level control of Adobe apps |

**Winner for most impressive:** Figma MCP (official) — Claude can read live design files and generate pixel-accurate frontend code. Canva MCP is impressive for non-devs.

---

### 8. CODE EXECUTION SANDBOXES

| Tool | What It Does | GitHub / URL | Notes |
|------|-------------|-------------|-------|
| **E2B MCP** | Secure cloud microVMs; code execution | github.com/e2b-dev/mcp-server | `claude mcp add e2b -- npx -y @e2b/mcp-server`; spins up in <200ms |
| **Modal** (Claude Skill) | Serverless GPU execution | modal.com | Python decorator = cloud GPU; `@modal.function()` runs remotely |
| **E2B Desktop Sandbox** | Full GUI desktop VM in cloud | e2b.dev/docs | Claude gets a full computer to use safely |

**Why E2B is the standout:** Built the desktop sandbox concept before Anthropic announced Computer Use. Manus (the viral "autonomous AI agent") runs on E2B infrastructure. 88% of Fortune 100 companies are signed up.

---

### 9. DATABASE AND INFRASTRUCTURE

| Tool | What It Does | GitHub / URL | Notes |
|------|-------------|-------------|-------|
| **Supabase MCP** (official) | Create projects, manage Postgres, run SQL, manage auth/branches | github.com/supabase-community/supabase-mcp | `claude mcp add --transport http supabase https://mcp.supabase.com` |
| **Vercel MCP** (official) | Connect Claude to Vercel projects, read logs, docs, metadata | vercel.com/docs/mcp | `claude mcp add --transport http vercel https://mcp.vercel.com` — currently read-only beta |
| **GitHub MCP** (official GitHub) | Manage repos, PRs, issues, code search | github.com/github/github-mcp-server | `claude mcp add --transport http github https://api.githubcopilot.com/mcp/` |
| **Official Filesystem MCP** | Secure local file read/write | github.com/modelcontextprotocol/servers | `claude mcp add filesystem -- npx -y @modelcontextprotocol/server-filesystem /allowed/path` |

---

### 10. WILD CARDS (The "Wait, Claude Can Do THAT?" Tools)

| Tool | What It Does | GitHub / URL | Why It's Wild |
|------|-------------|-------------|---------------|
| **Smithery Toolbox** | Single MCP that auto-routes to all 4,000+ servers dynamically | smithery.ai | You don't need to install anything — one MCP gives you access to every MCP based on what your agent needs |
| **Context7 MCP** | Fetches real-time documentation for any library during coding | github.com/upstash/context7 | No more hallucinated API docs; Claude gets current docs inline |
| **GPT Researcher MCP** | Deep research agent: plans, searches, writes citation-backed reports | github.com/assafelovic/gptr-mcp | Claude spawns a sub-agent that does multi-step web research and produces sourced reports |
| **ElevenLabs MCP (official)** | Voice cloning, TTS, STT, outbound voice agents making phone calls | github.com/elevenlabs/elevenlabs-mcp | Claude can call phone numbers. Real outbound voice calls via AI. |
| **Ableton MCP** (ahujasid) | Claude composes and produces music in Ableton Live | github.com/ahujasid/ableton-mcp | "Metro Boomin-style beat" → actual Ableton project |
| **Blender MCP** (ahujasid) | Claude creates 3D scenes in Blender | github.com/ahujasid/blender-mcp | Prompt → 3D model in seconds |
| **Unity MCP** (justinpbarnett) | Claude builds playable games in Unity | github.com/justinpbarnett/unity-mcp | Entire platformer game from one prompt |
| **Claude Computer Use** (Anthropic) | Claude sees your screen and controls your computer | platform.claude.com/docs | First frontier AI with public desktop control API |
| **E2B Desktop Sandbox** | Claude gets a full computer in the cloud to safely operate | e2b.dev | Isolated GUI VM — Claude can do anything on a "throwaway" computer |
| **Claude Code as MCP Server** (steipete) | Run Claude Code as a sub-agent inside another AI agent | github.com/steipete/claude-code-mcp | Agent-in-agent: Claude orchestrating Claude |
| **Premiere Pro MCP** (toonyai) | Claude finds video clips by speech transcription and auto-cuts them | LobeHub: toonyai-premiere-mcp | Describe the clip you want → Claude finds it by audio content and adds to timeline |

---

## PHASE 3: CONNECTIONS AND OVERLAPS

### Competition map
- **E2B vs Modal**: Both cloud execution, different ICP. E2B = agent sandboxing (safety, isolation, disposable VMs). Modal = GPU compute for ML workloads (Stable Diffusion, fine-tuning). They don't fully overlap.
- **Browserbase vs browser-use**: Browserbase is managed cloud infrastructure for browser sessions. browser-use is an open-source framework that can run on Browserbase or locally. They're complementary — browser-use uses Browserbase as its recommended backend.
- **BrowserMCP.io vs Playwright MCP vs Claude in Chrome**: BrowserMCP.io controls the user's existing Chrome profile (cookies, sessions intact). Playwright MCP spins up a fresh browser. Claude in Chrome integrates directly into the Claude Code CLI. Different use cases.
- **Smithery vs Glama vs PulseMCP vs mcpservers.org vs mcp.so**: All are MCP registries competing for discovery traffic. Smithery is winning on hosting (4k+ servers, 18k calls/day). Smithery Toolbox is a moat move — if you install one MCP that routes to all others, you never need the registry UI.

### Collaboration/Ecosystem
- Siddharth Ahuja (Blender MCP + Ableton MCP) is the single most prolific creative-tool MCP builder. His work directly inspired the Unity MCP, Unreal MCP, FL Studio MCP wave.
- Browserbase employs Anirudh Kamath (Stagehand lead) and Paul Klein (CEO/founder). Their open-source Stagehand drives adoption of paid Browserbase cloud.
- Browser Use (Magnus + Gregor) is YC-backed and uses browser-use as the open-source lead gen for their upcoming commercial product.
- Anthropic's official MCP servers (Puppeteer, Filesystem, GitHub) set the baseline; community builds everything else.

---

## PHASE 4: CONFIRMED GAPS (Survived Disproval Attempts)

### GAP CLAIM 1: No clean, polished After Effects MCP for motion designers (non-technical)
**DISPROVAL ATTEMPTS:**
- Searched "After Effects MCP server Claude natural language motion graphics 2025 2026" → Found Dakkshin/after-effects-mcp and mikechambers/adb-mcp
- Searched "Adobe After Effects dedicated MCP UXP natural language Claude" → Both found tools use ExtendScript (legacy) not UXP (modern)
- Checked People Map: no one is building an AE-native UXP-based MCP

**VERDICT: NARROWED**
**SURVIVING CLAIM:** After Effects MCPs exist but rely on legacy ExtendScript API. No tool uses Adobe's modern UXP plugin system, which would be more stable and capable. A polished, UXP-native After Effects MCP built for non-technical motion designers does not exist.

---

### GAP CLAIM 2: No Logic Pro MCP (macOS-only DAW, largest professional user base after Pro Tools)
**DISPROVAL ATTEMPTS:**
- Searched "Logic Pro MCP server Claude audio music composition AI integration 2025" → Found FL Studio and Ableton MCPs, nothing for Logic Pro
- Searched "Logic Pro AI integration MCP model context protocol" → No results for Logic Pro MCP
- Checked People Map: Siddharth Ahuja built Ableton and FL Studio exists via veenastudio; no Logic Pro mentioned anywhere

**VERDICT: CONFIRMED GAP**
Logic Pro has no MCP integration. Given that Logic Pro is Apple-exclusive and uses a proprietary scripting environment (not MIDI-based like Ableton), this is a legitimate gap. Logic Pro has AppleScript + Environment scripting, which could theoretically support MCP bridging.

---

### GAP CLAIM 3: No Pro Tools MCP (industry standard for film/TV/record labels)
**DISPROVAL ATTEMPTS:**
- Searched "Pro Tools MCP Claude AI DAW integration" → Nothing found
- Searched "Avid Pro Tools MCP server model context protocol" → No results
- Checked People Map: all DAW builders are in consumer/prosumer space (Ableton, FL Studio)

**VERDICT: CONFIRMED GAP**
Pro Tools (Avid) has no MCP. Pro Tools dominates professional audio post-production (every major film, TV show, album is mixed in Pro Tools). It has a proprietary SDK. High-value gap for audio post-production professionals.

---

### GAP CLAIM 4: Vercel MCP is currently read-only (cannot deploy)
**DISPROVAL ATTEMPTS:**
- Searched "Vercel MCP deploy Claude directly" → Official docs confirm: "for our initial launch, the server is read-only"
- Searched "Vercel MCP write access deploy pull request 2025 2026" → Community MCP by nganiet claims deploy support but unofficial

**VERDICT: CONFIRMED (as of Feb 2026)**
Official Vercel MCP cannot deploy. It can only read project data, logs, and metadata. nganiet/mcp-vercel is a community alternative that may support deployment. A Claude Skill for Vercel deploy exists (mcpservers.org/claude-skills/vercel/vercel-deploy) as a workaround.

---

## PHASE 5: CONTRADICTIONS AND GRAVEYARD SIGNALS

### Graveyard Signal 1: Claude in Chrome went "unavailable" on Chrome Web Store (February 5, 2026)
Anthropic's own official browser extension went dark on the Chrome Web Store as of February 5, 2026. It launched as a limited beta in August 2025, expanded to all paid plans in December 2025, then disappeared. This may indicate rapid iteration, a Chrome policy issue, or strategic repositioning. Do not build workflows dependent on it until it stabilizes.

### Graveyard Signal 2: MCP market growth was explosive but ecosystem is still mostly hobbyist-grade
Downloads went from 100k (Nov 2024) to 8M (April 2025) — 80x growth. But the majority of MCP servers are community builds by solo devs. Only a handful (Supabase, Vercel, GitHub, Figma, Canva, ElevenLabs) are official, production-grade tools from the companies themselves. The 4,000+ servers on Smithery include enormous amounts of experimental/unmaintained tools.

### Contradiction 1: The biggest funded infra companies (E2B, Browserbase, Browser Use, Modal) are all infrastructure plays — not end-user experience plays
Solo developers like Siddharth Ahuja (Blender, Ableton) and Justin Barnett (Unity) built the most viral, most-talked-about "wait, Claude can do THAT?" tools with zero funding. The VC money went to cloud execution layers (E2B, Modal, Browserbase), not to the creative-application layer. This is where opportunity sits for builders.

### Contradiction 2: E2B built "Computer Use" before Anthropic announced it
E2B had a Desktop Sandbox product — AI-controlled virtual desktops — six months before Anthropic announced Computer Use in October 2024. This means the concept was independently validated by the market before Anthropic blessed it. E2B's moat is not being first; it's being open-source and infra-agnostic.

### Contradiction 3: Claude Skills are potentially bigger than MCP, but far less discussed
Simon Willison (creator of Datasette, prolific AI commentator) wrote: "Claude Skills are awesome, maybe a bigger deal than MCP." Skills are instruction sets (SKILL.md files) that Claude loads contextually during tasks. They're simpler than MCP (no servers, no processes) and composable. The project directory C:\Users\dangr\.claude\skills is a live example of this. But the developer conversation is 10x more about MCP than Skills.

---

## INSTALLATION QUICK REFERENCE

### Setup any MCP in Claude Code:
```bash
# HTTP transport (remote servers - recommended)
claude mcp add --transport http <name> <url>

# stdio transport (local servers)
claude mcp add <name> -- npx -y <package-name>

# View installed MCPs
claude mcp list
```

### Top 10 MCPs to install right now (production-tested):
```bash
# 1. GitHub (official)
claude mcp add --transport http github https://api.githubcopilot.com/mcp/

# 2. Supabase (official)
claude mcp add --transport http supabase https://mcp.supabase.com

# 3. Figma (official)
claude mcp add --transport http figma https://mcp.figma.com/mcp

# 4. Vercel (official, read-only)
claude mcp add --transport http vercel https://mcp.vercel.com

# 5. Miro (official)
claude mcp add --transport http miro https://mcp.miro.com

# 6. Desktop Commander (terminal + file system)
npx -y @wonderwhy-er/desktop-commander@latest setup

# 7. Playwright (Microsoft, browser automation)
claude mcp add playwright -- npx @playwright/mcp@latest

# 8. Puppeteer (Anthropic official, browser automation)
claude mcp add puppeteer -- npx -y @modelcontextprotocol/server-puppeteer

# 9. ElevenLabs (official, TTS + STT + voice)
# Requires ELEVENLABS_API_KEY in env
claude mcp add elevenlabs -- npx -y @elevenlabs/elevenlabs-mcp

# 10. Context7 (real-time library documentation)
claude mcp add context7 -- npx -y @upstash/context7-mcp
```

### Creative tools (jaw-drop demos):
```bash
# Blender MCP (3D modeling)
# Requires Blender installed; install Blender addon first
claude mcp add blender -- python /path/to/blender_mcp/server.py

# Ableton MCP (music production)
pip install ableton-mcp
# Then install MIDI Remote Script in Ableton

# Unity MCP (game development)
# Install via Unity Package Manager
# github.com/justinpbarnett/unity-mcp
```

### Code execution sandboxes:
```bash
# E2B (secure cloud VMs)
claude mcp add e2b -- npx -y @e2b/mcp-server
# Set E2B_API_KEY environment variable

# Modal (serverless GPU)
pip install modal
# See skill at: mcpmarket.com/tools/skills/modal-cloud-computing
```

---

## SOURCES

Research used the following primary sources:

- [E2B official site and docs](https://e2b.dev)
- [Browserbase company blog and funding](https://www.browserbase.com)
- [Browser Use GitHub and YC profile](https://github.com/browser-use/browser-use)
- [Blender MCP GitHub](https://github.com/ahujasid/blender-mcp)
- [Ableton MCP GitHub](https://github.com/ahujasid/ableton-mcp)
- [Unity MCP GitHub](https://github.com/justinpbarnett/unity-mcp)
- [Desktop Commander MCP](https://github.com/wonderwhy-er/DesktopCommanderMCP)
- [Smithery registry](https://smithery.ai)
- [awesome-mcp-servers (punkpeye)](https://github.com/punkpeye/awesome-mcp-servers)
- [awesome-mcp-servers (wong2)](https://github.com/wong2/awesome-mcp-servers)
- [Microsoft Playwright MCP](https://github.com/microsoft/playwright-mcp)
- [Figma MCP official docs](https://developers.figma.com/docs/figma-mcp-server/)
- [Canva AI Connector](https://www.canva.com/ai-connector/)
- [ElevenLabs MCP official](https://github.com/elevenlabs/elevenlabs-mcp)
- [Supabase MCP](https://github.com/supabase-community/supabase-mcp)
- [Vercel MCP](https://vercel.com/docs/mcp)
- [Claude Computer Use API](https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool)
- [Claude in Chrome official](https://code.claude.com/docs/en/chrome)
- [Claude Skills explained](https://claude.com/blog/skills-explained)
- [Simon Willison on Claude Skills](https://simonwillison.net/2025/Oct/16/claude-skills/)
- [Builder.io best MCP servers 2026](https://www.builder.io/blog/best-mcp-servers-2026)
- [DaVinci Resolve MCP](https://github.com/samuelgursky/davinci-resolve-mcp)
- [Premiere Pro MCP](https://github.com/hetpatel-11/Adobe_Premiere_Pro_MCP)
- [After Effects MCP](https://github.com/Dakkshin/after-effects-mcp)
- [fal.ai MCP](https://github.com/raveenb/fal-mcp-server)
- [awesome-claude-skills (travisvn)](https://github.com/travisvn/awesome-claude-skills)
- [Claude Flow orchestration](https://github.com/ruvnet/claude-flow)
- [Computer Use OOTB](https://github.com/showlab/computer_use_ootb)
- [Modal Labs](https://modal.com)
- [Miro MCP](https://developers.miro.com/docs/connecting-miro-mcp-to-ai-coding-tools)
