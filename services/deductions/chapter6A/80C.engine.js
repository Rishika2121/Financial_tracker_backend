function section80C(payload) {

  const d = payload.deductions || {};

  const ppf = Number(d.ppf || 0);
  const lic = Number(d.lic || 0);
  const elss = Number(d.elss || 0);
  const homeLoanPrincipal = Number(d.homeLoanPrincipal || 0);
  const tuitionFees = Number(d.tuitionFees || 0);

  const total =
    ppf +
    lic +
    elss +
    homeLoanPrincipal +
    tuitionFees;

  return total;
}

module.exports = { section80C };