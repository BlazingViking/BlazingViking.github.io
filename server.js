import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

app.post("/api/chat", async (req, res) => {
  const userMessage = req.body.message;
  const response = await fetch("https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.HF_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ inputs: userMessage }),
  });

  const data = await response.json();
  res.json({ reply: data[0]?.generated_text || "Sorry, I didn’t understand that." });
});

app.listen(3000, () => console.log("✅ Server running on http://localhost:3000"));
