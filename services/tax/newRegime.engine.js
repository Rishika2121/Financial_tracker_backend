function calculateNewRegimeTax(income) {

  let tax = 0;

  if (income <= 400000) return 0;

  if (income <= 800000)
      tax = (income - 400000) * 0.05;

  else if (income <= 1200000)
      tax = 20000 + (income - 800000) * 0.10;

  else if (income <= 1600000)
      tax = 60000 + (income - 1200000) * 0.15;

  else if (income <= 2000000)
      tax = 120000 + (income - 1600000) * 0.20;

  else if (income <= 2400000)
      tax = 200000 + (income - 2000000) * 0.25;

  else
      tax = 300000 + (income - 2400000) * 0.30;

  return tax;
}

module.exports = { calculateNewRegimeTax };
