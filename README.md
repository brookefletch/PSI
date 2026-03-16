# PSI & ETS Competitive Analysis Agent

## What's in this package

```
index.html    — The frontend (all UI, no API key needed by users)
server.js     — Thin Node.js proxy that holds your API key securely
package.json  — Dependencies
README.md     — This file
```

## Why this architecture

The frontend calls **your server** at `/api/analyze`. Your server adds your
Anthropic API key and forwards to Anthropic. This means:
- Your API key is never in the browser or in any public file
- Users don't need their own API key — they just use the app
- Works on any hosting provider: Railway, Render, Fly.io, Heroku, VPS, etc.

---

## Deploy to Railway (recommended — free tier available)

1. Create a free account at https://railway.app
2. Click **New Project → Deploy from GitHub repo**
3. Push this folder to a GitHub repo, connect it
4. In your Railway project, go to **Variables** and add:
   ```
   ANTHROPIC_API_KEY = sk-ant-your-key-here
   ```
5. Railway auto-detects Node.js and runs `npm start`. Done.
   You'll get a public URL like `https://your-app.railway.app`

---

## Deploy to Render (also free tier)

1. Create account at https://render.com
2. **New → Web Service → Connect your GitHub repo**
3. Settings:
   - Build command: `npm install`
   - Start command: `npm start`
4. Add environment variable: `ANTHROPIC_API_KEY = sk-ant-...`
5. Deploy. You'll get `https://your-app.onrender.com`

---

## Deploy to Fly.io

```bash
npm install -g flyctl
fly auth login
fly launch        # follow prompts, choose a region
fly secrets set ANTHROPIC_API_KEY=sk-ant-your-key-here
fly deploy
```

---

## Run locally

```bash
npm install
ANTHROPIC_API_KEY=sk-ant-your-key-here npm start
# then open http://localhost:3000
```

On Windows (Command Prompt):
```cmd
set ANTHROPIC_API_KEY=sk-ant-your-key-here
npm start
```

---

## Cost

Each analysis run uses Claude Sonnet with web search. Typical cost: **$0.10–$0.30 per run**
depending on how many focus areas are selected. Monitor usage at https://console.anthropic.com
