function calculateLetOutInterest(userProfile, letOutInterest) {

  if (!userProfile.isLetOutProperty) {
    return 0;
  }

  if (!letOutInterest || letOutInterest <= 0) {
    return 0;
  }

  return letOutInterest;
}

export default calculateLetOutInterest;