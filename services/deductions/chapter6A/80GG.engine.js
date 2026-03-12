function section80GG(payload){

  const d = payload.deductions || {};

  const rentPaid = Number(d.rentPaid || 0);
  const income = Number(payload.income || 0);

  const limit1 = 60000;
  const limit2 = rentPaid - (0.1 * income);
  const limit3 = 0.25 * income;

  return Math.max(0, Math.min(limit1, limit2, limit3));

}

module.exports = { section80GG };