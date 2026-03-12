function section80TTA(payload){

  const d = payload.deductions || {};

  const interest = Number(d.savingsInterest || 0);

  return Math.min(interest, 10000);
}

module.exports = { section80TTA };