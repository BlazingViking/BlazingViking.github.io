import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Missing message" });
  }

  try {
    // Use Hugging Face free API
    const response = await fetch("https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HF_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: message }),
    });

    const data = await response.json();
    const botReply = data?.generated_text || data[0]?.generated_text || "Sorry, I didn’t understand that.";

    res.status(200).json({ reply: botReply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
}
