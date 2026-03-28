const express = require("express");
const router = express.Router();
const OpenAI = require("openai");

// Initialize OpenAI conditionally to prevent crashing if the key is completely missing
let openai;
try {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "missing_key",
  });
} catch (err) {
  console.error("Failed to initialize OpenAI client:", err);
}

router.post("/chat", async (req, res) => {
  try {
    const { question, userData } = req.body;

    if (!question) {
      return res.status(400).json({ reply: "Please ask a question." });
    }

    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "your_key_here") {
      return res.status(500).json({ 
        error: "Missing API Key", 
        reply: "Backend Error: Please set a valid OPENAI_API_KEY in the .env file. Currently, the key is missing or invalid." 
      });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an Indian tax expert. Answer simply and concisely in a friendly tone.",
        },
        {
          role: "user",
          content: `User Data: ${JSON.stringify(userData || {})} \n Question: ${question}`,
        },
      ],
    });

    res.json({
      reply: response.choices[0].message.content,
    });
  } catch (err) {
    console.error("OpenAI API Error details:", err.message);
    
    // Provide a safe fallback response so the frontend doesn't show "Bot: undefined"
    let errorMessage = "Sorry, I am having trouble connecting to the AI server. Please try again later.";
    
    if (err.status === 401) {
      errorMessage = "Backend Error: The configured OpenAI API key is invalid or expired.";
    } else if (err.status === 429) {
      errorMessage = "Backend Error: OpenAI API quota exceeded (Rate Limit). Please check your billing details.";
    }

    res.status(500).json({ error: err.message, reply: errorMessage });
  }
});

module.exports = router;