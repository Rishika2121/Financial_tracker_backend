function section80CCD(payload){

  const d = payload.deductions || {};

  const nps = Number(d.nps || 0);

  // This NPS goes straight to the 1.5L combined 80C group limit
  return nps;
}

module.exports = { section80CCD };