// Frontend script: sends message to backend and shows replies

const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// LOCAL: if testing on your machine use this:
// const API_URL = "http://localhost:3000/api/chat";

// DEPLOYED (replace with your real URL after deploy):
const API_URL = "https://chatbotdemo-nine.vercel.app/api/chat"; // change when deployed

function addMessage(text, sender) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);
  msg.innerText = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function getBotReply(message) {
  try {
    const resp = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    if (!resp.ok) {
      console.error("Bad response", resp.status, await resp.text());
      return "⚠️ There was a problem connecting to the server.";
    }

    const data = await resp.json();
    return data.reply || "Sorry, I didn't understand that.";
  } catch (err) {
    console.error("Fetch error:", err);
    return "⚠️ There was a problem connecting to the server.";
  }
}

sendBtn.onclick = async () => {
  const message = userInput.value.trim();
  if (!message) return;
  addMessage(message, "user");
  userInput.value = "";

  // Add temporary typing message
  addMessage("Typing...", "bot");

  const botReply = await getBotReply(message);

  // Replace the typing message with actual reply
  const last = chatBox.lastChild;
  if (last) last.innerText = botReply;
};

userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendBtn.click();
});
