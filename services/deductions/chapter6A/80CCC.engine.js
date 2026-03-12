function section80CCC(payload){

 const d = payload.deductions || {}

 const pensionFund = Number(d.pensionFund || 0)

 return pensionFund

}

module.exports = { section80CCC }