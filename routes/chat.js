const express = require("express");
const router = express.Router();
const OpenAI = require("openai");

// ✅ Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ✅ Chat Route
router.post("/chat", async (req, res) => {
  try {
    const body = req.body || {};

    // ✅ Accept multiple frontend formats
    const question =
      body.question ||
      body.message ||
      body.prompt ||
      body.text;

    const userData = body.userData || {};

    // ✅ 1. Validate question
    if (!question) {
      return res.json({
        reply: "⚠️ No question received from frontend.",
      });
    }

    // ✅ 2. Check API key
    if (!process.env.OPENAI_API_KEY) {
      return res.json({
        reply: "⚠️ OpenAI API key missing in backend.",
      });
    }

    // ✅ 3. Call OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an expert Indian tax assistant. Give simple, clear, practical answers in a friendly tone.",
        },
        {
          role: "user",
          content: `User Data: ${JSON.stringify(userData)}\nQuestion: ${question}`,
        },
      ],
    });

    // ✅ 4. Send response
    res.json({
      reply: response.choices[0].message.content,
    });

  } catch (error) {
    console.error("OpenAI Error:", error.message);

    let errorMessage = "❌ AI is currently unavailable.";

    if (error.status === 401) {
      errorMessage = "❌ Invalid OpenAI API key.";
    } else if (error.status === 429) {
      errorMessage = "❌ OpenAI quota exceeded. Try later.";
    }

    res.json({
      reply: errorMessage,
    });
  }
});

module.exports = router;