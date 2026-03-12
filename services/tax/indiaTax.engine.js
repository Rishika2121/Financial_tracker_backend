// ========================================
// IMPORTS (MUST BE AT TOP)
// ========================================

const { applyNewRegimeDeductions } = require("../deductions/newRegime/newRegimeDeductionMaster");
const { calculateOldRegimeTax } = require("./oldRegime.engine");
const { calculateNewRegimeTax } = require("./newRegime.engine");
const { applyRebate } = require("./rebate.engine");
const { applySurcharge } = require("./surcharge.engine");
const { applyAllDeductions } = require("../deductions/deductionMaster");
const { calculate44AD } = require("../presumptive/44AD.engine.js");
const { calculate44ADA } = require("../presumptive/44ADA.engine.js");
const { calculate44AE } = require("../presumptive/44AE.engine.js");


// ========================================
// MARGINAL RELIEF
// ========================================
function applyMarginalRelief(income, taxWithSurcharge, regime, age) {
  const limits = [50000000, 20000000, 10000000, 5000000];

  for (let limit of limits) {
    if (income > limit) {
      let taxAtLimit = 0;
      if (regime === "old") {
        taxAtLimit = calculateOldRegimeTax(limit, age);
      } else {
        taxAtLimit = calculateNewRegimeTax(limit);
      }

      let surchargeRateAtLimit = 0;
      if (limit === 10000000) surchargeRateAtLimit = 0.10;
      else if (limit === 20000000) surchargeRateAtLimit = 0.15;
      else if (limit === 50000000) surchargeRateAtLimit = regime === "new" ? 0.25 : 0.25;

      const surchargeAtLimit = taxAtLimit * surchargeRateAtLimit;
      const totalTaxAtLimit = taxAtLimit + surchargeAtLimit;
      const excessIncome = income - limit;

      const maxTaxAllowed = totalTaxAtLimit + excessIncome;

      return Math.min(taxWithSurcharge, maxTaxAllowed);
    }
  }

  return taxWithSurcharge;
}


// ========================================
// MAIN TAX ENGINE
// ========================================
function calculateIndiaTax(payload) {

  console.log("PAYLOAD RECEIVED:", payload);

  const { incomeType, regime } = payload;

let grossSalary = 0;
let incomeFromInterest = 0;
let incomeFromHouseProperty = 0;
let incomeFromOtherSources = 0;
let businessIncome = 0;

switch (incomeType) {

  case "NORMAL":
    grossSalary = Number(payload.incomeFromSalary) || 0;
    incomeFromInterest = Number(payload.incomeFromInterest) || 0;
    incomeFromHouseProperty = Number(payload.incomeFromHouseProperty) || 0;
    incomeFromOtherSources = Number(payload.incomeFromOtherSources) || 0;
    break;
case "BUSINESS":

  const turnover = Number(payload.turnover) || 0;

  const expenseFields = [
    "rent",
    "salary",
    "electricity",
    "internet",
    "advertisement",
    "repair",
    "professionalFees",
    "loanInterest",
    "depreciation",
    "otherExpenses"
  ];

  const expenses = expenseFields.reduce((total, field) => {
    return total + (Number(payload[field]) || 0);
  }, 0);

  // BUSINESS PROFIT (cannot be negative for tax computation)
  businessIncome = Math.max(0, turnover - expenses);

  break;
  case "44AD":
    const adTurnover = Number(payload.turnover) || 0;
    
    if (adTurnover > 30000000) {
      throw new Error("44AD allowed only up to ₹3 crore turnover");
    }

    const digital = Number(payload.digitalTurnover) || 0;
    const cash = Number(payload.cashTurnover) || 0;

    if (digital === 0 && cash === 0) {
      businessIncome = adTurnover * 0.08;
    } else {
      businessIncome = (digital * 0.06) + (cash * 0.08);
    }
    break;

  case "44ADA":
    const receipts = Number(payload.turnover) || 0;
    businessIncome = receipts * 0.50;
    break;

  case "44AE":
    const vehicles = Number(payload.vehicles) || 0;
    businessIncome = vehicles * 7500 * 12;
    break;

  default:
    throw new Error("Invalid incomeType");
}
 const grossIncome = grossSalary + incomeFromInterest + incomeFromHouseProperty + incomeFromOtherSources + businessIncome;

// Loss is allowed for BUSINESS, but does not affect deductions flag directly here.
 
  // ===============================
  // STANDARD DEDUCTION
  // =============================

  // ===============================
// DEDUCTIONS
// ===============================
// ===============================
// DEDUCTIONS
// ===============================

let chapter6A = 0;
let standardDeduction = 0;
let deductionsBreakdown = {};

// 1. Calculate Standard Deduction first
if (incomeType === "NORMAL" && grossSalary > 0) {
  if (regime === "old") {
    standardDeduction = Math.min(grossSalary, 50000);
  } else {
    standardDeduction = Math.min(grossSalary, 75000); // FY 2025-26 limit
  }
}

if (
  incomeType === "44AD" ||
  incomeType === "44ADA" ||
  incomeType === "44AE"
) {
  standardDeduction = 0;
}

// 2. Calculate Chapter VI-A Deductions
if (regime === "old") {
  const result = applyAllDeductions(payload);
  chapter6A = result.total;
  deductionsBreakdown = result.breakdown;
} else if (regime === "new") {
  const result = applyNewRegimeDeductions(payload);
  chapter6A = result.total;
  deductionsBreakdown = result.breakdown;
}

if (
  incomeType === "44AD" ||
  incomeType === "44ADA" ||
  incomeType === "44AE"
) {
  chapter6A = 0;
}

// FINAL TOTAL
const totalDeductions = chapter6A + standardDeduction;

// Taxable Income is Gross Income - Standard Deduction - Chapter VIA
const taxableIncome = Math.max(0, grossIncome - standardDeduction - chapter6A);

console.log("Gross Income:", grossIncome);
console.log("Standard Deduction:", standardDeduction);
console.log("Chapter VI-A:", chapter6A);
console.log("Total Deductions (Std + 6A):", totalDeductions);
console.log("Taxable Income:", taxableIncome);
  // ===============================
  // TAX ORDER: SLAB -> REBATE -> SURCHARGE -> MARGINAL RELIEF -> CESS

  const ageNum = payload.selfAge || 30;
  let tax = 0;

  // 1. SLAB TAX
  if (regime === "old") {
    tax = calculateOldRegimeTax(taxableIncome, ageNum);
  } else {
    tax = calculateNewRegimeTax(taxableIncome);
  }

  const slabTax = tax; // Store base slab tax for UI

  // 2. REBATE
  tax = applyRebate(taxableIncome, tax, regime);

  // 3. SURCHARGE (FY 2025-26)
  let surchargeRate = 0;
  if (taxableIncome > 50000000) surchargeRate = regime === "new" ? 0.25 : 0.37;
  else if (taxableIncome > 20000000) surchargeRate = 0.25;
  else if (taxableIncome > 10000000) surchargeRate = 0.15;
  else if (taxableIncome > 5000000) surchargeRate = 0.10;

  let surcharge = tax * surchargeRate;
  tax = tax + surcharge;

  // 4. MARGINAL RELIEF
  const reliefAdjustedTax = applyMarginalRelief(taxableIncome, tax, regime, ageNum);
  
  // Actually, marginal relief reduces the surcharge portion visually for the user.
  // But strictly, let's just adjust the overall tax.
  let reliefGiven = tax - reliefAdjustedTax;
  tax = reliefAdjustedTax;

  // 5. CESS
  let cess = 0;
  if (tax > 0) {
    cess = tax * 0.04;
  }
  
  const totalTax = tax + cess;

  const tds = Number(payload.taxPaid?.tds) || 0;
  const advance = Number(payload.taxPaid?.advance) || 0;
  const totalPaid = tds + advance;

  const netPayable = Math.max(0, totalTax - totalPaid);

  const breakdown = regime === "old"
    ? getOldRegimeBreakdown(taxableIncome, ageNum)
    : getNewRegimeBreakdown(taxableIncome);

  return {
    grossIncome,
    standardDeduction,
    chapter6A,
    totalDeductions,
    deductionsBreakdown,
    taxableIncome,
    slabTax,
    taxBeforeCess: tax,
    surcharge: surcharge - reliefGiven, // Effective surcharge after relief
    cess,
    totalTax,
    taxesPaid: totalPaid,
    netTaxPayable: netPayable,
    netTax: netPayable,
    breakdown
  };
}

function getNewRegimeBreakdown(income) {
   const slabs = [];
   slabs.push({ range: "0 - 4L", tax: 0, rate: "0%" });
   if (income > 400000) slabs.push({ range: "4L - 8L", tax: Math.min(income - 400000, 400000) * 0.05, rate: "5%" });
   if (income > 800000) slabs.push({ range: "8L - 12L", tax: Math.min(income - 800000, 400000) * 0.10, rate: "10%" });
   if (income > 1200000) slabs.push({ range: "12L - 16L", tax: Math.min(income - 1200000, 400000) * 0.15, rate: "15%" });
   if (income > 1600000) slabs.push({ range: "16L - 20L", tax: Math.min(income - 1600000, 400000) * 0.20, rate: "20%" });
   if (income > 2000000) slabs.push({ range: "20L - 24L", tax: Math.min(income - 2000000, 400000) * 0.25, rate: "25%" });
   if (income > 2400000) slabs.push({ range: "> 24L", tax: (income - 2400000) * 0.30, rate: "30%" });
   return slabs.filter(s => s.tax > 0 || String(s.rate) === "0%");
}

function getOldRegimeBreakdown(income, age) {
   let basicLimit = 250000;
   if (age >= 60 && age < 80) basicLimit = 300000;
   if (age >= 80) basicLimit = 500000;
   const slabs = [];
   slabs.push({ range: `0 - ${basicLimit/100000}L`, tax: 0, rate: "0%" });
   if (income > basicLimit) slabs.push({ range: `${basicLimit/100000}L - 5L`, tax: Math.min(income - basicLimit, 500000 - basicLimit) * 0.05, rate: "5%" });
   if (income > 500000) slabs.push({ range: "5L - 10L", tax: Math.min(income - 500000, 500000) * 0.20, rate: "20%" });
   if (income > 1000000) slabs.push({ range: "> 10L", tax: (income - 1000000) * 0.30, rate: "30%" });
   return slabs.filter(s => s.tax > 0 || String(s.rate) === "0%");
}

module.exports = { calculateIndiaTax };