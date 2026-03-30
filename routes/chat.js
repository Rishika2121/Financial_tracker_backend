const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

// ✅ Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ✅ Chat Route
router.post("/chat", async (req, res) => {
  try {
    const body = req.body || {};

    // ✅ Accept multiple formats from frontend
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

    // ✅ 2. Validate API key
    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        reply: "⚠️ Gemini API key missing in backend (.env).",
      });
    }

    // ✅ 3. Create model
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    // ✅ 4. System prompt (important for behavior)
    const systemPrompt =
      "You are an expert Indian tax assistant. Give simple, clear, practical answers in a friendly tone.";

    // ✅ 5. Final prompt
    const finalPrompt = `
${systemPrompt}

User Data:
${JSON.stringify(userData, null, 2)}

User Question:
${question}
`;

    // ✅ 6. Call Gemini
    const result = await model.generateContent(finalPrompt);
    const response = result.response.text();

    // ✅ 7. Send response
    res.json({
      reply: response,
    });

  } catch (error) {
    console.error("Gemini Error:", error.message);

    let errorMessage = "❌ AI is currently unavailable.";

    if (error.message?.includes("API key not valid")) {
      errorMessage = "❌ Invalid Gemini API key.";
    } else if (error.message?.includes("429")) {
      errorMessage = "❌ Gemini quota exceeded. Try later.";
    }

    res.json({
      reply: errorMessage,
    });
  }
});

module.exports = router;