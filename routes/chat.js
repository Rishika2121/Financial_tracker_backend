const express = require("express");
const router = express.Router();
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

router.post("/chat", async (req, res) => {
  try {

    const { question, userData } = req.body;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an Indian tax expert. Answer simply."
        },
        {
          role: "user",
          content: `User Data: ${JSON.stringify(userData)} \n Question: ${question}`
        }
      ]
    });

    res.json({
      answer: response.choices[0].message.content
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI error" });
  }
});

module.exports = router;