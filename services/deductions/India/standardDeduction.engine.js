function calculateStandardDeduction(userProfile, income) {
  if (userProfile.incomeSource === "salary") {
    return 50000;
  }
  return 0;
}

module.exports = { calculateStandardDeduction };
