function section80D(payload) {

  const { deductions } = payload;

  const selfInsurance = Number(deductions?.selfInsurance) || 0;
  const parentsInsurance = Number(deductions?.parentsInsurance) || 0;
  const selfAge = Number(deductions?.selfAge) || 0;
  const parentsAge = Number(deductions?.parentsAge) || 0;

  const selfLimit = selfAge >= 60 ? 50000 : 25000;
  const parentLimit = parentsAge >= 60 ? 50000 : 25000;

  const selfAllowed = Math.min(selfInsurance, selfLimit);
  const parentAllowed = Math.min(parentsInsurance, parentLimit);

  return selfAllowed + parentAllowed;
}

module.exports = { section80D };
