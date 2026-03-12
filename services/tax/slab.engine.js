function calculateSlabTax(income, slabs) {
  let tax = 0;
  let lastLimit = 0;

  for (let slab of slabs) {
    if (income > slab.upto) {
      tax += (slab.upto - lastLimit) * (slab.rate / 100);
      lastLimit = slab.upto;
    } else {
      tax += (income - lastLimit) * (slab.rate / 100);
      break;
    }
  }
  return tax;
}

module.exports = { calculateSlabTax };
