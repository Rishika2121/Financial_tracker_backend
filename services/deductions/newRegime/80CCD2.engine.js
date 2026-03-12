function section80CCD2(payload){

  const d = payload.deductions || {};
  const salary = Number(payload.income || 0);

  const employerNPS = Number(d.employerNps || 0);

  const limit = salary * 0.10;

  return Math.min(employerNPS, limit);

}

module.exports = { section80CCD2 };