function calculateEmployerNPS(userProfile, salary, employerNpsContribution) {

  if (userProfile.incomeSource !== "salary") {
    return 0;
  }

  if (!employerNpsContribution || employerNpsContribution <= 0) {
    return 0;
  }

  let limitPercent = 0.10; // private employee

  if (userProfile.employeeType === "government") {
    limitPercent = 0.14;
  }

  const maxAllowed = salary * limitPercent;

  return Math.min(employerNpsContribution, maxAllowed);
}

module.exports = { calculateEmployerNPS };
