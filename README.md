# Pressure Log — Blood Pressure Tracker

A small React app for logging and visualizing blood pressure readings.
Data is stored in your browser's `localStorage`, so it stays on whichever
device/browser you use it in (no login, no server required).

## Run it locally

You'll need [Node.js](https://nodejs.org) (v18+) installed.

```bash
npm install
npm run dev
```

Then open the URL it prints (usually `http://localhost:5173`).

## Deploy to Vercel

### Option A — via GitHub (recommended, easiest to update later)

1. Create a new repo on GitHub and push this folder to it:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```
2. Go to [vercel.com](https://vercel.com) and sign in (GitHub login is easiest).
3. Click **Add New → Project**, then select your repo.
4. Vercel auto-detects Vite — leave the defaults (Build Command: `vite build`,
   Output Directory: `dist`) and click **Deploy**.
5. You'll get a live URL like `pressure-log.vercel.app`. Every future push to
   `main` auto-redeploys.

### Option B — via Vercel CLI (fastest, no GitHub needed)

```bash
npm install -g vercel
vercel login
vercel
```

Answer the prompts (defaults are fine), and it deploys straight from your
laptop. Run `vercel --prod` to push to your production URL.

## Notes on data

- Readings live in `localStorage` in your browser — clearing browser data or
  switching browsers/devices means a fresh, empty log.
- If you want your data to follow you across devices (e.g. phone and
  laptop), the next step would be adding a small backend — a good
  lightweight option is [Vercel KV](https://vercel.com/docs/storage/vercel-kv)
  or [Supabase](https://supabase.com) (free tiers on both). Ask Claude to
  help wire one of those in whenever you're ready.
