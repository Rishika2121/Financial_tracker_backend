function section80U(payload){

  const d = payload.deductions || {};

  if (!d.disabilityType || d.disabilityType === "none") {
    return 0;
  }

  return d.disabilityType === "severe"
    ? 125000
    : 75000;
}

module.exports = { section80U };