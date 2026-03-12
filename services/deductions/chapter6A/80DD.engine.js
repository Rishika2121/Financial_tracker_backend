function section80DD(payload){

  const d = payload.deductions || {};

  if (!d.dependentDisability || d.dependentDisability === "none") {
    return 0;
  }

  return d.dependentDisability === "severe"
    ? 125000
    : 75000;
}

module.exports = { section80DD };