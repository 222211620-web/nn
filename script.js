const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const darkModeToggle = document.getElementById("dark-mode-toggle");

// إرسال الرسالة
async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  appendMessage("user", message);
  userInput.value = "";

  const res = await fetch("http://localhost:3000/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  const data = await res.json();
  appendMessage("bot", data.reply || "No response from server.");
}

// عرض الرسالة في الصفحة
function appendMessage(sender, text) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// عند الضغط على زر الإرسال
sendBtn.addEventListener("click", sendMessage);

// عند الضغط على Enter
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

// تفعيل الوضع الليلي
darkModeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});
