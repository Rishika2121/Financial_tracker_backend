function applyNewRegimeDeductions(payload) {

  const d = payload.deductions || {};

  let breakdown = {
    employerNps: 0,
    agniveerContribution: 0,
    additionalEmployeeCost: 0,
    leaveEncashment: 0,
    familyPension: 0,
    gratuityAmount: 0,
    letOutPropertyInterest: 0
  };

  // Employer NPS (80CCD(2))
  const employerNps = Number(d.employerNpsContribution ?? 0);
  breakdown.employerNps = employerNps;

  // Agniveer Corpus (80CCH)
  breakdown.agniveerContribution = Number(d.agniveerContribution ?? 0);

  // Additional Employee Cost (80JJAA)
  breakdown.additionalEmployeeCost = Number(d.additionalEmployeeCost ?? 0);

  // Leave Encashment (Section 10(10AA))
  breakdown.leaveEncashment = Number(d.leaveEncashment ?? 0);

  // Family Pension (Section 57(iia))
  breakdown.familyPension = Number(d.familyPension ?? 0);

  // Gratuity (Section 10(10))
  breakdown.gratuityAmount = Number(d.gratuityAmount ?? 0);

  // Let Out Property Interest (Section 24b) maximum 2 Lakhs allowed under new regime for let out properties
  breakdown.letOutPropertyInterest = Number(d.letOutPropertyInterest ?? 0);

  const total = Object.values(breakdown)
    .reduce((sum, val) => sum + val, 0);

  return { total, breakdown };
}

module.exports = { applyNewRegimeDeductions };