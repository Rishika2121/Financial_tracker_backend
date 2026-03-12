// services/presumptive/44ADA.engine.js

function calculate44ADA({
  grossReceipts,
  cashReceipts = 0
}) {

  if (!grossReceipts) {
    return {
      eligible: false,
      reason: "Gross receipts are required for 44ADA"
    };
  }

  // Step 1: Calculate cash percentage
  const cashPercent = (cashReceipts / grossReceipts) * 100;

  // Step 2: Decide max limit
  // 50L normally, 75L if cash <= 5%
  const maxLimit = cashPercent <= 5 ? 7500000 : 5000000;

  if (grossReceipts > maxLimit) {
    return {
      eligible: false,
      reason: "Gross receipts exceed 44ADA limit"
    };
  }

  // Step 3: Presumptive income = 50%
  const presumptiveIncome = grossReceipts * 0.5;

  return {
    eligible: true,
    section: "44ADA",
    grossReceipts,
    cashPercent,
    presumptiveIncome
  };
}

module.exports = { calculate44ADA };
