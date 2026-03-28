require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const { Pool } = require("pg");

const taxRoutes = require("./routes/tax.routes");
const chatRoutes = require("./routes/chat");   // ✅ chatbot route

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Static files
app.use(express.static(path.join(__dirname, "public")));

// ✅ Routes
app.use("/api/tax", taxRoutes);
app.use("/api", chatRoutes);

// ✅ Health check
app.get("/health", (req, res) => {
  res.send("Backend running");
});

// ❌ OPTIONAL (you said no DB needed → keep or remove)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

pool.connect()
  .then(() => console.log("✅ DB connected"))
  .catch(() => console.log("⚠️ No DB, skipping..."));

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});