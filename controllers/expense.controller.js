let expenses = [];

function saveExpense(req, res) {
  expenses.push(req.body);
  res.json({ message: "Expense added", expenses });
}

module.exports = { saveExpense, expenses };
