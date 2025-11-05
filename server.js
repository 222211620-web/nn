import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.static("."));
app.use(bodyParser.json());

console.log("✅ Checking API key...");
if (!process.env.OPENAI_API_KEY) {
  console.error("❌ ERROR: OPENAI_API_KEY not found in .env file!");
  process.exit(1);
} else {
  console.log("✅ OPENAI_API_KEY loaded successfully!");
}

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful English-speaking assistant." },
          { role: "user", content: userMessage },
        ],
      }),
    });

    const data = await response.json();

    // اطبع الرد كامل في التيرمنال لمعرفة الخطأ إن وجد
    console.log("🔍 OpenAI Response:", data);

    if (!data.choices || !data.choices[0]) {
      return res.status(500).json({ error: "Invalid response from OpenAI API" });
    }

    const botReply = data.choices[0].message.content;
    res.json({ reply: botReply });
  } catch (error) {
    console.error("❌ Server Error:", error);
    res.status(500).json({ error: "Server error, please try again later." });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
