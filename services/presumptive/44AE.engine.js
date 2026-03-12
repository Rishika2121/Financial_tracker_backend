// services/presumptive/44AE.engine.js

function calculate44AE({ vehicles = [] }) {

  if (vehicles.length === 0) {
    return {
      eligible: false,
      reason: "No vehicles provided"
    };
  }

  if (vehicles.length > 10) {
    return {
      eligible: false,
      reason: "More than 10 vehicles not allowed under 44AE"
    };
  }

  let presumptiveIncome = 0;

  vehicles.forEach(v => {
    if (v.type === "heavy") {
      presumptiveIncome += v.months * 30000;
    } else {
      presumptiveIncome += v.months * 7500;
    }
  });

  return {
    eligible: true,
    section: "44AE",
    presumptiveIncome
  };
}

module.exports = { calculate44AE };
