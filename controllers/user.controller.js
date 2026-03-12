let userProfile = null;

function saveUser(req, res) {
  userProfile = req.body;
  res.json({ message: "User profile saved", userProfile });
}

module.exports = { saveUser, userProfile };
