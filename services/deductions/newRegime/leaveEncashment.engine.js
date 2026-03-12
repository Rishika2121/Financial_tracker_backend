function leaveEncashment(payload){

  const d = payload.deductions || {};
  return Number(d.leaveEncashment || 0);

}

module.exports = { leaveEncashment };