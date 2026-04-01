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
    console.log(process.env.GROQ_API_KEY ? "✅ Groq API key found" : "⚠️ Groq API key NOT found"  );
    // ✅ 2. Check API key
    if (!process.env.GROQ_API_KEY) {
      return res.json({
        reply: "⚠️ Groq API key missing in backend.",
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

    // ✅ 4. Call Groq API (free, fast, reliable)
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: "You are an expert Indian tax assistant. Answer clearly, simply, and practically." },
          { role: "user", content: `User Data: ${JSON.stringify(userData)}\n\nQuestion: ${question}` }
        ],
        temperature: 0.7,
        max_tokens: 1024,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Groq Response:", response.data);

    // ✅ 5. Extract response safely
    let reply = "⚠️ No response from AI.";

    if (response.data?.choices?.[0]?.message?.content) {
      reply = response.data.choices[0].message.content;
    }

    console.log("AI Reply:", reply);

    res.json({ reply });

  } catch (error) {
    console.error("Groq Error:", error.message);
    console.error("Status Code:", error.response?.status);
    console.error("Response Data:", error.response?.data);

    let errorMessage = "❌ AI is currently unavailable. Try again later.";

    if (error.response?.status === 401) {
      errorMessage = "❌ Invalid Groq API key.";
    } else if (error.response?.status === 429) {
      errorMessage = "❌ Too many requests. Please wait and try again.";
    } else if (error.response?.status === 503) {
      errorMessage = "⏳ Groq service is temporarily unavailable. Try again in a few seconds.";
    }

    res.json({ reply: errorMessage });
  }
});

module.exports = router;