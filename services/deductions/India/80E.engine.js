function calculate80E(payload, regime) {

  if (regime !== "old") return 0;

  // Education loan interest (no upper limit)
  const interest =
    Number(payload.deductions?.educationLoanInterest) || 0;

  return interest;
}

module.exports = { calculate80E };
