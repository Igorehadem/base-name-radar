# ENS + FNames Name Checker

A simple unified checker for:

-   **ENS (.eth) domain availability**
-   **Farcaster FName availability (@username)**

Instant API + clean UI, deployed on Vercel.

------------------------------------------------------------------------

## 🚀 Live Demo

https://`<your-vercel-domain>`{=html}/check

(Replace with your actual Vercel URL)

------------------------------------------------------------------------

## ✨ Features

-   Check **name.eth** using ENSIdeas resolver API\
-   Check **Farcaster FNames** using the official `fnames.farcaster.xyz`
    registry\
-   Clean minimal UI for fast lookup\
-   Edge-friendly API (Next.js 14 / App Router)\
-   Fully serverless, no RPC or blockchain client required

------------------------------------------------------------------------

## 📡 API

### `GET /api/name/:name`

Checks both ENS and FName availability.

**Example request:**

/api/name/igoreha

**Example response:**

``` json
{
  "name": "igoreha",
  "ens": {
    "service": "ensideas",
    "domain": "igoreha.eth",
    "available": false,
    "address": "0xabc...",
    "displayName": "igoreha.eth",
    "avatar": "https://..."
  },
  "fname": {
    "service": "farcaster-fnames",
    "name": "igoreha",
    "available": false,
    "currentOwnerFid": 123456,
    "ownerAddress": "0x123...",
    "lastTransferTimestamp": 1716730000
  }
}
```

------------------------------------------------------------------------

## 🖥️ UI

Open:

/check

Enter any base name → check ENS + FName availability instantly.

------------------------------------------------------------------------

## 🛠️ Local Development

``` bash
npm install
npm run dev
```

App will run at:

http://localhost:3000

------------------------------------------------------------------------

## 📁 Project Structure

    app/
      api/
        name/[name]/route.ts   # Unified ENS + FNames API
      check/
        page.tsx               # UI
      globals.css
      layout.tsx
      page.tsx                 # Home page

    public/
      icon.png
      manifest.json

    next.config.js
    vercel.json
    package.json
    LICENSE
    README.md

------------------------------------------------------------------------

## 📜 License

MIT
