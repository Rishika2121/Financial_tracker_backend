function calculateAdditionalEmployeeCost(userProfile, additionalEmployeeCost) {

  if (userProfile.incomeSource !== "business") {
    return 0;
  }

  if (!additionalEmployeeCost || additionalEmployeeCost <= 0) {
    return 0;
  }

  return additionalEmployeeCost * 0.30;
}

export default calculateAdditionalEmployeeCost;