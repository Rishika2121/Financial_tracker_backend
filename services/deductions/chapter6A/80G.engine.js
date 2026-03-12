function section80G(payload){

  const d = payload.deductions || {};

  const donation = Number(d.donation || 0);
  const donationType = d.donationType || "none";

  if(donationType === "none") return 0;

  if(donationType === "100"){
    return donation;
  }

  if(donationType === "50"){
    return donation * 0.5;
  }

  return 0;
}

module.exports = { section80G };