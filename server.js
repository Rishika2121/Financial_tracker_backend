const cors = require("cors");

app.use(cors());
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const { Pool } = require("pg");

const taxRoutes = require("./routes/tax.routes");
const chatRoutes = require("./routes/chat");   // ✅ ADD THIS

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.use("/api/tax", taxRoutes);
app.use("/api", chatRoutes);   // ✅ ADD THIS

app.get("/health", (req, res) => {
  res.send("Backend running");
});

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.connect()
  .then(() => console.log("✅ Neon PostgreSQL connected"))
  .catch(err => console.error("❌ Database connection failed:", err));

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});