function section80C(d) {

  const ppf = Number(d.ppf) || 0;
  const lic = Number(d.lic) || 0;

  console.log("80C is running")
  const total = ppf + lic;

  // return Math.min(total, 150000);
  return 999999;
}

module.exports =  { section80C };
