const chatBox = document.createElement("div");
chatBox.innerHTML = `
  <h3>💬 AI Chatbot</h3>
  <div id="chat-output" style="height:200px; overflow:auto; border:1px solid #aaa; padding:5px; margin-bottom:10px;"></div>
  <input id="user-input" placeholder="Type your message..." style="width:70%;">
  <button id="send-btn">Send</button>
`;
document.body.appendChild(chatBox);

const output = document.getElementById("chat-output");
const input = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keypress", e => {
  if (e.key === "Enter") sendMessage();
});

async function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  output.innerHTML += `<div><b>You:</b> ${text}</div>`;
  input.value = "";

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text }),
    });

    const data = await res.json();
    const reply = data.reply || "Error: no response";
    output.innerHTML += `<div><b>Bot:</b> ${reply}</div>`;
    output.scrollTop = output.scrollHeight;
  } catch (err) {
    output.innerHTML += `<div style="color:red;">Error connecting to chatbot.</div>`;
  }
}
