function agniveerContribution(payload) {

  const d = payload.deductions || {};
  const contribution = Number(d.agniveerContribution ?? 0);

  return contribution > 0 ? contribution : 0;
}

module.exports = { agniveerContribution };