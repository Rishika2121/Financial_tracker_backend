function section80E(payload){

  const d = payload.deductions || {};

  const interest = Number(d.educationLoanInterest || 0);

  return interest;
}

module.exports = { section80E };