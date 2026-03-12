// services/presumptive/44AD.engine.js

function calculate44AD({
  turnover,
  digitalTurnover = 0,
  cashTurnover = 0
}) {

  if (!turnover) {
    return {
      eligible: false,
      reason: "Turnover is required for 44AD"
    };
  }

  // STEP 1: cash % calculation
  const cashPercent = (cashTurnover / turnover) * 100;

  // STEP 2: decide max turnover limit
  const maxLimit = cashPercent <= 5 ? 30000000 : 20000000;

  if (turnover > maxLimit) {
    return {
      eligible: false,
      reason: "Turnover exceeds 44AD limit"
    };
  }

  // STEP 3: presumptive income
  const presumptiveIncome =
    (digitalTurnover * 0.06) +
    (cashTurnover * 0.08);

  return {
    eligible: true,
    section: "44AD",
    turnover,
    cashPercent,
    presumptiveIncome
  };
}

module.exports = { calculate44AD };
