function gratuityDeduction(payload){

  const d = payload.deductions || {};
  return Number(d.gratuity || 0);

}

module.exports = { gratuityDeduction };