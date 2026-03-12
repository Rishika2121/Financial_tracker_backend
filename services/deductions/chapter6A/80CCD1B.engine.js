function section80CCD1B(payload) {
  const d = payload.deductions || {};
  const nps1b = Number(d.nps1b || 0);

  // Maximum ₹50,000 deduction under 80CCD(1B)
  const additionalNPS = Math.min(nps1b, 50000);

  return additionalNPS;
}

module.exports = { section80CCD1B };
