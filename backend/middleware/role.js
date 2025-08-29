function isProvider(req, res, next) {
  if (req.user && req.user.role === "provider") {
    return next();
  }
  return res.status(403).json({ error: "Zugriff verweigert (nur Provider)" });
}

module.exports = { isProvider };
