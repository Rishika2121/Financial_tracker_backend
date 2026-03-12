function calculateFamilyPension(familyPensionIncome) {

  if (!familyPensionIncome || familyPensionIncome <= 0) {
    return 0;
  }

  const oneThird = familyPensionIncome / 3;

  return Math.min(oneThird, 25000);
}

export default calculateFamilyPension;