const express = require("express");
const router = express.Router();
const OpenAI = require("openai");

// Initialize OpenAI safely
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
    const incomingBody = req.body || {};

    // Accept multiple frontend formats
    const question =
      incomingBody.question ||
      incomingBody.message ||
      incomingBody.prompt ||
      incomingBody.text;

    const userData = incomingBody.userData;

    // ✅ 1. Check if question exists
    if (!question) {
      return res.json({
        reply: `⚠️ Frontend issue: No question received. Keys received: [${Object.keys(
          incomingBody
        ).join(", ")}]`,
      });
    }

    // ✅ 2. Check API Key
    if (
      !process.env.OPENAI_API_KEY ||
      process.env.OPENAI_API_KEY.includes("your_key_here") ||
      process.env.OPENAI_API_KEY === "missing_key"
    ) {
      return res.json({
        reply:
          "⚠️ OpenAI API key is missing or invalid. Please add a valid key in backend (.env and Render Environment).",
      });
    }

    // ✅ 3. Call OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an expert Indian tax assistant. Give clear, simple, practical answers in a friendly tone.",
        },
        {
          role: "user",
          content: `User Data: ${JSON.stringify(
            userData || {}
          )}\nQuestion: ${question}`,
        },
      ],
    });

    // ✅ 4. Send response
    res.json({
      reply: response.choices[0].message.content,
    });
  } catch (err) {
    console.error("OpenAI API Error:", err.message);

    let errorMessage =
      "❌ AI is currently unavailable. Please try again later.";

    if (err.status === 401) {
      errorMessage =
        "❌ Invalid OpenAI API key. Please check your backend configuration.";
    } else if (err.status === 429) {
      errorMessage =
        "❌ OpenAI quota exceeded. Please check billing or usage limits.";
    }

    // Always return 200 so frontend shows message
    res.json({
      reply: errorMessage,
    });
  }
});

module.exports = router;