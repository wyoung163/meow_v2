const express = require("express");
const router = express.Router();

router.get("/logout", async (req, res, next) => {
  if (req.session.user) {
    req.session.destroy((err) => {
      if (err) throw err;
      res.redirect("/");
    });
  } else {
    res.redirect("/");
  }
});

module.exports = router;
