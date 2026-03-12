function applyRebate(income, tax, regime) {

  // Old Regime: Rebate up to ₹5,00,000
  if (regime === "old") {
    if (income <= 500000) return 0;
    // Marginal relief for rebate under old regime 87A
    if (income > 500000 && income <= 515000) {
      return Math.min(tax, income - 500000);
    }
  }

  // New Regime: FY 2025-26 Rebate up to ₹12,00,000
  if (regime === "new") {
    if (income <= 1200000) return 0;
    // Marginal relief for rebate under new regime 87A (income > 12L)
    if (income > 1200000 && income <= 1275000) {
      return Math.min(tax, income - 1200000);
    }
  }

  return tax;
}

module.exports = { applyRebate };
