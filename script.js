// --- Select chat elements ---
const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// --- Your backend URL ---
// If running locally: "http://localhost:3000/api/chat"
// After deploying to Vercel or Netlify: ""
const API_URL = "https://blazingviking.github.io/api/chat";

// --- Function: add a message to the chat ---
function addMessage(text, sender) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);
  msg.innerText = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// --- Function: get bot reply from backend ---
async function getBotReply(message) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    if (!response.ok) throw new Error("Server error");
    const data = await response.json();
    return data.reply || "Sorry, I didn’t understand that.";
  } catch (error) {
    console.error("Error:", error);
    return "⚠️ There was a problem connecting to the server.";
  }
}

// --- Handle send button click ---
sendBtn.onclick = async () => {
  const message = userInput.value.trim();
  if (!message) return;
  
  // Add user's message
  addMessage(message, "user");
  userInput.value = "";

  // Add temporary "typing..." message
  addMessage("Typing...", "bot");

  // Get reply from backend
  const botReply = await getBotReply(message);

  // Replace the last message with bot's actual reply
  chatBox.lastChild.innerText = botReply;
};

// --- Send message on Enter key ---
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendBtn.click();
});
