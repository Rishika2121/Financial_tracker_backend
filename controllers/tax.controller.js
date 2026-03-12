const { calculateIndiaTax } = require("../services/tax/indiaTax.engine");

exports.calculateTax = (req, res) => {
  try {

    console.log("BODY RECEIVED:", req.body);

    const result = calculateIndiaTax(req.body);

    res.json(result);

  } catch (error) {

    console.error("TAX CONTROLLER ERROR:", error);

    res.status(500).json({ error: "Calculation failed" });
  }
};