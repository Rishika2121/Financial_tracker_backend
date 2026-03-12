function section80EEA(payload){

 const d = payload.deductions || {}

 const interest = Number(d.affordableHousingInterest || 0)

 return Math.min(interest,150000)

}

module.exports = { section80EEA }