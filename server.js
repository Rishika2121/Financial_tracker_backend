// const express = require("express");
// const cors = require("cors");
// const mysql = require("mysql2");
// const path = require("path");

// const taxRoutes = require("./routes/tax.routes"); // 🔴 ADD THIS

// const app = express();
// const PORT = 3000;

// // Serve frontend
// app.use(express.static(path.join(__dirname, "public")));

// app.use(cors());
// app.use(express.json());

// // ROOT ROUTE
// app.get("/", (req, res) => {
//   res.send("Backend running and DB connected");
// });

// // 🔴 TAX ROUTES
// app.use("/api/tax", taxRoutes);

// // DB CONNECTION
// const db = mysql.createConnection({
//   host: "127.0.0.1",
//   user: "root",
//   password: "Root@123",
//   database: "expense_tax_db",
//   port: 3306
// });

// db.connect((err) => {
//   if (err) {
//     console.error("❌ Database connection failed:", err.message);
//   } else {
//     console.log("✅ Database connected successfully");
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Backend running on http://localhost:${PORT}`);
// });




const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const path = require("path");

const taxRoutes = require("./routes/tax.routes");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve frontend from public folder
app.use(express.static(path.join(__dirname, "public")));

// API Routes
app.use("/api/tax", taxRoutes);

// Root route (optional)
app.get("/health", (req, res) => {
  res.send("Backend running and DB connected");
});

// DB CONNECTION
const db = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "Root@123",
  database: "expense_tax_db",
  port: 3306
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
  } else {
    console.log("✅ Database connected successfully");
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
