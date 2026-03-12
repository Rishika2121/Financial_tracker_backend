// ================================
// IMPORTS
// ================================

// Presumptive sections
const { calculate44AD } = require("./presumptive/44AD.engine");
const { calculate44ADA } = require("./presumptive/44ADA.engine");
const { calculate44AE } = require("./presumptive/44AE.engine");

// Tax slabs
const { calculateOldRegimeTax } = require("./tax/oldRegime.engine");
const { calculateNewRegimeTax } = require("./tax/newRegime.engine");

// OLD REGIME deductions
const { calculate80C } = require("./deductions/India/80C.engine").default;
const { calculate80D } = require("./deductions/India/80D.engine");
const { calculate80E } = require("./deductions/India/80E.engine");
const {
  calculateStandardDeduction: calculateOldStandardDeduction
} = require("./deductions/India/standardDeduction.engine");

// NEW REGIME deductions
const {
  calculateStandardDeduction: calculateNewStandardDeduction
} = require("./deductions/newRegime/standardDeduction.service");

const {
  calculateEmployerNPS
} = require("./deductions/newRegime/employerNps.service");

// OPTIONAL MASTER INDIA ENGINE
const { calculateIndiaTax } = require("./tax/indiaTax.engine");



// ================================
// MASTER TAX ENGINE
// ================================
function calculateFinalTax({
  incomeType,
  income = 0,
  turnover = 0,
  digitalTurnover = 0,
  cashTurnover = 0,
  userProfile = {},
  expenses = [],
  useMasterEngine = false
}) {

  income = Number(income) || 0;
  turnover = Number(turnover) || 0;
  digitalTurnover = Number(digitalTurnover) || 0;
  cashTurnover = Number(cashTurnover) || 0;

  const age = userProfile.age || 30;
  const regime = userProfile.regime || "new";


  // ======================================
  // OPTIONAL MASTER INDIA ENGINE
  // ======================================
  if (useMasterEngine === true) {
    return calculateIndiaTax({
      regime,
      income,
      capitalGains: 0,
      stt: 0
    });
  }


  // ======================================
  // 44AD
  // ======================================
  if (incomeType === "44AD") {

    const result = calculate44AD({
      turnover,
      digitalTurnover,
      cashTurnover
    });

    if (!result.eligible) return result;

    const deduction80C = calculate80C(expenses, "old");

    const taxableIncome =
      Math.max(0, result.presumptiveIncome - deduction80C);

    let baseTax = calculateOldRegimeTax(taxableIncome, age);

    if (taxableIncome <= 500000) baseTax = 0;

    const cess = baseTax * 0.04;

    return {
      incomeType: "44AD",
      regime: "old",
      presumptiveIncome: result.presumptiveIncome,
      deductions: { section80C: deduction80C },
      taxableIncome,
      taxBeforeCess: baseTax,
      cess,
      taxPayable: baseTax + cess
    };
  }


  // ======================================
  // 44ADA
  // ======================================
  if (incomeType === "44ADA") {

    const result = calculate44ADA({
      grossReceipts: income,
      cashReceipts: cashTurnover
    });

    if (!result.eligible) return result;

    const deduction80C = calculate80C(expenses, "old");

    const taxableIncome =
      Math.max(0, result.presumptiveIncome - deduction80C);

    let baseTax = calculateOldRegimeTax(taxableIncome, age);

    if (taxableIncome <= 500000) baseTax = 0;

    const cess = baseTax * 0.04;

    return {
      incomeType: "44ADA",
      regime: "old",
      presumptiveIncome: result.presumptiveIncome,
      deductions: { section80C: deduction80C },
      taxableIncome,
      taxBeforeCess: baseTax,
      cess,
      taxPayable: baseTax + cess
    };
  }


  // ======================================
  // 44AE
  // ======================================
  if (incomeType === "44AE") {

    const result = calculate44AE({ vehicles: expenses });

    if (!result.eligible) return result;

    const deduction80C = calculate80C(expenses, "old");

    const taxableIncome =
      Math.max(0, result.presumptiveIncome - deduction80C);

    let baseTax = calculateOldRegimeTax(taxableIncome, age);

    if (taxableIncome <= 500000) baseTax = 0;

    const cess = baseTax * 0.04;

    return {
      incomeType: "44AE",
      regime: "old",
      presumptiveIncome: result.presumptiveIncome,
      deductions: { section80C: deduction80C },
      taxableIncome,
      taxBeforeCess: baseTax,
      cess,
      taxPayable: baseTax + cess
    };
  }


  // ======================================
  // NORMAL INCOME
  // ======================================
  if (incomeType === "NORMAL") {

    let standardDeduction = 0;
    let totalDeductions = 0;
    let taxableIncome = 0;
    let baseTax = 0;

    // ---------- OLD REGIME ----------
    if (regime === "old") {

      const d80C = calculate80C(expenses, "old");
      const d80D = calculate80D(expenses, "old");
      const d80E = calculate80E(expenses, "old");

      standardDeduction =
        calculateOldStandardDeduction(userProfile, income);

      totalDeductions =
        d80C + d80D + d80E + standardDeduction;

      taxableIncome =
        Math.max(0, income - totalDeductions);

      baseTax = calculateOldRegimeTax(taxableIncome, age);

      // Rebate 87A (Old)
      if (taxableIncome <= 500000) {
        baseTax = 0;
      }
    }


    // ---------- NEW REGIME ----------
    if (regime === "new") {

      standardDeduction =
        calculateNewStandardDeduction(userProfile, income);

      const employerNpsDeduction =
        calculateEmployerNPS(
          userProfile,
          income,
          userProfile.employerNpsContribution || 0
        );

      totalDeductions =
        standardDeduction + employerNpsDeduction;

      taxableIncome =
        Math.max(0, income - totalDeductions);

      baseTax = calculateNewRegimeTax(taxableIncome);

      // Rebate 87A (New FY 2024-25)
      if (taxableIncome <= 700000) {
        baseTax = 0;
      }
    }

    const cess = baseTax * 0.04;
    const finalTax = baseTax + cess;

    return {
      income,
      regime,
      deductions: {
        standardDeduction
      },
      totalDeductions,
      taxableIncome,
      taxBeforeCess: baseTax,
      cess,
      taxPayable: finalTax
    };
  }

  return { error: "Invalid incomeType" };
}


// ================================
// EXPORT
// ================================
module.exports = {
  calculateFinalTax
};
