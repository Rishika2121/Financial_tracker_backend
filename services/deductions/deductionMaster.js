const { section80CCC } = require("./chapter6A/80CCC.engine");
const { section80EE } = require("./chapter6A/80EE.engine");
const { section80EEA } = require("./chapter6A/80EEA.engine");
const { section80GG } = require("./chapter6A/80GG.engine");
const { section80DDB } = require("./chapter6A/80DDB.engine");
const { section80C } = require("./chapter6A/80C.engine");
const { section80D } = require("./chapter6A/80D.engine");
const { section80E } = require("./chapter6A/80E.engine");
const { section80G } = require("./chapter6A/80G.engine");
const { section80CCD } = require("./chapter6A/80CCD.engine");
const { section80CCD1B } = require("./chapter6A/80CCD1B.engine");
const { section80TTA } = require("./chapter6A/80TTA.engine");
const { section80TTB } = require("./chapter6A/80TTB.engine");
const { section80U } = require("./chapter6A/80U.engine");
const { section80DD } = require("./chapter6A/80DD.engine");

function applyAllDeductions(payload) {

  const { regime, deductions = {} } = payload;

 let breakdown = {

  section80C: 0,
  section80CCC: 0,
  section80D: 0,
  section80E: 0,
  section80G: 0,
  section80CCD: 0,
  section80CCD1B: 0,
  section80TTA: 0,
  section80TTB: 0,
  section80U: 0,
  section80DD: 0,
  section80EE: 0,
  section80EEA: 0,
  section80GG: 0,
  section80DDB: 0

};

  if (regime === "old") {

    console.log("🔥 FULL DEDUCTIONS OBJECT:", deductions);

    // individual calculations
const c = section80C({ deductions });
const ccc = section80CCC({ deductions });
const ccd = section80CCD({ deductions });

// Combine 80C + 80CCC + 80CCD(1)
const combined = c + ccc + ccd;

breakdown.section80C = Math.min(combined, 150000);

// Extra NPS deduction (80CCD 1B)
breakdown.section80CCD1B = section80CCD1B({ deductions });

    breakdown.section80D   = section80D({ deductions });
    breakdown.section80E   = section80E({ deductions });
    breakdown.section80G   = section80G({ deductions });
    breakdown.section80TTA = section80TTA({ deductions });
    breakdown.section80TTB = section80TTB({ deductions });
    breakdown.section80U   = section80U({ deductions });
    breakdown.section80DD  = section80DD({ deductions });
breakdown.section80EE = section80EE(payload);
breakdown.section80EEA = section80EEA(payload);
breakdown.section80GG = section80GG(payload);
breakdown.section80DDB = section80DDB(payload);

  }

  const total = Object.values(breakdown)
    .reduce((a, b) => a + b, 0);

  return { total, breakdown };

}

module.exports = { applyAllDeductions };