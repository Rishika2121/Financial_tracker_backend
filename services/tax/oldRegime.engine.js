function calculateOldRegimeTax(income, age) {

  let basicLimit = 250000;

  if (age >= 60 && age < 80) basicLimit = 300000;
  if (age >= 80) basicLimit = 500000;

  let tax = 0;

  if (income <= basicLimit) return 0;

  if (income <= 500000)
      tax = (income - basicLimit) * 0.05;

  else if (income <= 1000000)
      tax = (500000 - basicLimit) * 0.05 +
            (income - 500000) * 0.20;

  else
      tax = (500000 - basicLimit) * 0.05 +
            500000 * 0.20 +
            (income - 1000000) * 0.30;

  return tax;
}

module.exports = { calculateOldRegimeTax };
