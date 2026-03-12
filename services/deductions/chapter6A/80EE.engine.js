function section80EE(payload){

 const d = payload.deductions || {}

 const interest = Number(d.homeLoanInterest80EE || 0)

 return Math.min(interest,50000)

}

module.exports = { section80EE }