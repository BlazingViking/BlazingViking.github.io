// api/chat.js (CommonJS / Node on Vercel is supported)
// If your project uses type: "module" on Vercel, rename or adjust accordingly.

import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ reply: "Method not allowed" });

  const { message } = req.body;
  if (!message) return res.status(400).json({ reply: "No message provided." });

  try {
    const response = await fetch("https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HF_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ inputs: message }),
    });
    const data = await response.json();
    const reply = data?.[0]?.generated_text ?? data?.generated_text ?? JSON.stringify(data);
    res.status(200).json({ reply });
  } catch (err) {
    console.error("HF call error:", err);
    res.status(500).json({ reply: "Error calling AI API." });
  }
}
