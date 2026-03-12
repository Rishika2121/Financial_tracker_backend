module.exports = {

  cess: 4,

  // Age based exemption
  exemptionLimits: {
    below60: 250000,
    senior60to80: 300000,
    above80: 500000
  },

  slabs: [
    { upto: 250000, rate: 0 },
    { upto: 500000, rate: 5 },
    { upto: 1000000, rate: 20 },
    { upto: Infinity, rate: 30 }
  ],

  rebate87A: {
    incomeLimit: 500000,
    maxRebate: 12500
  },

  surcharge: [
    { limit: 5000000, rate: 10 },   // 50L
    { limit: 10000000, rate: 15 },  // 1Cr
    { limit: 20000000, rate: 25 },  // 2Cr
    { limit: Infinity, rate: 37 }   // 5Cr+
  ]
};
