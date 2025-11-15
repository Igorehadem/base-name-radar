# Base Name Checker & Squatted Names Radar

A lightweight toolkit for discovering available names on Base (ENS / BNS) and tracking names that recently became free.  
Includes a web UI, public API, automated radar feed, and Farcaster Frame.

---

## ✨ Features

- **Instant name availability check**
- **Radar:** detects names that were taken and became free in the last hours
- **Farcaster Frame:** check names directly in Warpcast
- **Daily auto-scan** (GitHub Actions or Cloudflare Cron)
- **API-first design** — easy to integrate into bots/tools
- **Fully open-source**

---

## 🧠 How it works

1. `/api/name/:name` queries ENS/BNS resolver on Base and returns:
   - `available | taken`
   - expiration info
   - owner address
   - resolver state

2. A scheduled scanner iterates through a collection of names and compares:
   - previous state → current state  
   - if a name changed from **taken → free**, it’s added to `radar.json`.

3. `/api/radar` serves this JSON feed.

4. Optional: a Farcaster bot posts notable frees using Neynar.

---

## 🛠 Tech Stack

- **Next.js 14 (App Router)**
- **TypeScript**
- **Wagmi v2 + viem**
- **Cloudflare/Edge-compatible API routes**
- **ENS / BNS resolver on Base**
- **GitHub Actions (cron)**
- **Neynar SDK (optional)**

---

## 📬 API

### `GET /api/name/:name`
Check availability.

```json
{
  "name": "example",
  "available": true,
  "owner": null,
  "expires": null,
  "chain": "base"
}
```

### `GET /api/radar`
List of recently freed names.

```json
[
  { "name": "alpha", "freedAt": "2025-02-12T09:00:00Z" },
  { "name": "solarpunk", "freedAt": "2025-02-12T08:20:00Z" }
]
```

---

## 🖼 UI & Frames

### Web pages
- `/check?name=xyz` — availability check  
- `/recent` — radar feed  

### Frames
- `/frame/check` — input frame for Warpcast  
- `/frame/radar` — list of freshest free names  

---

## ⚙️ Setup

```bash
npm install
npm run dev
```

Add `.env.local`:

```
RPC_BASE=
NEY_NAR_API_KEY=
```

(Optional — only needed for Farcaster posts)

---

## 🔄 Cron Automation

Example GitHub Actions workflow (`.github/workflows/radar-cron.yml`):

- Runs every 30–60 minutes  
- Executes `scripts/scan-names.ts`  
- Updates `data/radar.json`  
- Optionally triggers Farcaster post

---

## 📁 Project Structure

```
app/
  api/
    name/[name]/route.ts
    radar/route.ts
    cron/scan/route.ts
  check/
  recent/

frame/
  check.ts
  radar.ts
  og/

scripts/
  scan-names.ts
  update-radar.ts
  post-to-farcaster.ts

data/
  radar.json
```

---

## 🧪 Verification

This project is fully verifiable on GitHub:
- deterministic scripts  
- full commit history  
- readable scan results (`data/radar.json`)
- optional reproducible Farcaster posts

---
Near-term roadmap

- [ ] Improve scanner accuracy (detect all active Warpcast names)
- [ ] Add automatic hourly scanner (Vercel Cron)
- [ ] Recent frees UI + auto-refresh
- [ ] Add Base Names leaderboards (3-letter, OG names, dictionary words)
- [ ] Telegram bot for instant free-name alerts
- [ ] “Soon expiring” name watchlist
- [ ] Farcaster Frame: show last 5 freed names
- [ ] Marketplace module for dropping names


---

## 🗺 Roadmap

- [ ] BNS + Lens-style namespaces  
- [ ] Advanced filters (3-letter, dictionary words, brandables)  
- [ ] Telegram bot  
- [ ] Domain drop calendar  
- [ ] Marketplace for “soon expiring” names  

---

## 📜 License

MIT
