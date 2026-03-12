// ===============================
// BUSINESS INCOME CALCULATIONS
// ===============================

function calculateBusinessIncome(payload) {

  const turnover = Number(payload.turnover) || 0;
  const expenses = Number(payload.businessExpenses) || 0;

  const income = Math.max(0, turnover - expenses);

  return income;
}

// ===============================
// 44AD Presumptive Business
// ===============================

function calculate44AD(payload) {

  const turnover = Number(payload.turnover) || 0;

  if (turnover > 30000000) {
    throw new Error("44AD not allowed above ₹3 Crore turnover");
  }

  const digital = Number(payload.digitalTurnover) || 0;
  const cash = Number(payload.cashTurnover) || 0;

  if (digital === 0 && cash === 0) {
    return turnover * 0.08;
  }

  return (digital * 0.06) + (cash * 0.08);
}

// ===============================
// 44ADA Professional Income
// ===============================

function calculate44ADA(payload) {

  const receipts = Number(payload.turnover) || 0;

  if (receipts > 7500000) {
    throw new Error("44ADA not allowed above ₹75L receipts");
  }

  return receipts * 0.50;
}

// ===============================
// 44AE Transport
// ===============================

function calculate44AE(payload) {

  const vehicles = Number(payload.vehicles) || 0;

  return vehicles * 7500 * 12;
}

module.exports = {
  calculateBusinessIncome,
  calculate44AD,
  calculate44ADA,
  calculate44AE
};