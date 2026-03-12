function section80D(payload) {

  const d = payload.deductions || {};

  const selfInsurance = Number(d.selfInsurance || 0);
  const parentsInsurance = Number(d.parentsInsurance || 0);
  const preventiveCheckup = Number(d.preventiveCheckup || 0);

  const selfAge = Number(d.selfAge || 30);
  const parentsAge = Number(d.parentsAge || 60);

  const selfLimit = selfAge >= 60 ? 50000 : 25000;
  const parentsLimit = parentsAge >= 60 ? 50000 : 25000;

  const preventive = Math.min(preventiveCheckup, 5000);

  const selfTotal = Math.min(selfInsurance + preventive, selfLimit);
  const parentTotal = Math.min(parentsInsurance, parentsLimit);

  return selfTotal + parentTotal;
}

module.exports = { section80D };