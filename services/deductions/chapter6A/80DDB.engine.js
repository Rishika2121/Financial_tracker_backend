function section80DDB(payload){

 const d = payload.deductions || {}

 const medical = Number(d.medicalTreatment || 0)
 const age = payload.selfAge || 30

 const limit = age >= 60 ? 100000 : 40000

 return Math.min(medical,limit)

}

module.exports = { section80DDB }