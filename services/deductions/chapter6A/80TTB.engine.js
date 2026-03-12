function section80TTB(payload){

  const d = payload.deductions || {};

  const interest = Number(d.seniorInterest || 0);

  return Math.min(interest, 50000);
}

module.exports = { section80TTB };