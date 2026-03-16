import express from "express";
import fetch from "node-fetch";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { Readable } from "stream";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json({ limit: "2mb" }));
app.use(express.static(__dirname));

// ── Proxy endpoint ───────────────────────────────────────────────────────────
app.post("/api/analyze", async (req, res) => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "ANTHROPIC_API_KEY environment variable is not set." });
  }

  try {
    const upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "Accept-Encoding": "identity",
      },
      body: JSON.stringify(req.body),
    });

    if (req.body.stream && upstream.ok) {
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      res.status(200);
      const body = upstream.body;
      (typeof body.pipe === 'function' ? body : Readable.fromWeb(body)).pipe(res);
    } else {
      const data = await upstream.json();
      if (!upstream.ok) {
        console.error(`Anthropic error ${upstream.status}:`, JSON.stringify(data));
      }
      res.status(upstream.status).json(data);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`PSI/ETS agent running on http://localhost:${PORT}`));
