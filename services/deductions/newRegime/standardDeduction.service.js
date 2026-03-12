function calculateStandardDeduction(userProfile, income) {
  if (
    userProfile.incomeSource === "salary" ||
    userProfile.incomeSource === "pension"
  ) {
    return 75000;
  }
  return 0;
}

module.exports = { calculateStandardDeduction };
