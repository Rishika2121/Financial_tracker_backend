const express = require("express");
const router = express.Router();
const axios = require("axios");

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

    // ✅ 1. Validate input
    if (!question) {
      return res.json({
        reply: "⚠️ No question received from frontend.",
      });
    }

    // ✅ 2. Check API key
    if (!process.env.HUGGINGFACE_API_KEY) {
      return res.json({
        reply: "⚠️ Hugging Face API key missing in backend.",
      });
    }

    // ✅ 3. Create prompt (better response quality)
    const prompt = `
You are an expert Indian tax assistant. Answer clearly, simply, and practically.

User Data:
${JSON.stringify(userData)}

Question:
${question}
`;

    // ✅ 4. Call Hugging Face API
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
      {
        inputs: prompt,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // ✅ 5. Extract response safely
    let reply = "⚠️ No response from AI.";

    if (Array.isArray(response.data) && response.data[0]?.generated_text) {
      reply = response.data[0].generated_text;
    }

    res.json({ reply });

  } catch (error) {
    console.error("Hugging Face Error:", error.message);

    let errorMessage = "❌ AI is currently unavailable. Try again later.";

    if (error.response?.status === 401) {
      errorMessage = "❌ Invalid Hugging Face API key.";
    } else if (error.response?.status === 429) {
      errorMessage = "❌ Too many requests. Please wait and try again.";
    } else if (error.response?.status === 503) {
      errorMessage = "⏳ Model is loading. Try again in a few seconds.";
    }

    res.json({ reply: errorMessage });
  }
});

module.exports = router;