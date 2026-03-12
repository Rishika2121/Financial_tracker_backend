// console.log("✅ tax.routes.js loaded");

const express = require("express");
const router = express.Router();

const { calculateTax } = require("../controllers/tax.controller");

// Health check
router.get("/", (req, res) => {
  res.send("Tax route working");
});

// Status route
router.get("/status", (req, res) => {
  res.json({
    message: "Tax API is working",
    time: new Date()
  });
});

// Final tax calculation route
router.post("/calculate", calculateTax);

module.exports = router;