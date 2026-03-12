module.exports = {
  slabs: [
    { upto: 300000, rate: 0 },
    { upto: 600000, rate: 5 },
    { upto: 900000, rate: 10 },
    { upto: 1200000, rate: 15 },
    { upto: 1500000, rate: 20 },
    { upto: Infinity, rate: 30 }
  ],
  standardDeduction: 50000,
  rebate87A: {
    incomeLimit: 700000,
    maxRebate: 25000
  },
  cess: 4
};
