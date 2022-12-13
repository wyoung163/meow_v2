//프로필 수정 백
const express = require("express");
const router = express.Router();
const pool = require("../db.js");

router.get("/editProfile", async (req, res, next) => {
  const userid = req.session.user["userid"];
  const nickname = req.session.user["nickname"];
  try {
    const data = await pool.query(
      "SELECT user_id, age, gender, job, home, introduction FROM user WHERE user_id = ?",
      [userid]
    );
    res.render("User/editProfile", {
      title: "프로필 수정",
      nickname: nickname,
      row: data[0][0],
    });
  } catch (err) {
    console.error(err);
  }
});

router.post("/editProfile", async (req, res, next) => {
  const post = req.body;
  const home = post.home;
  const introduction = post.introduction;
  const userid = req.session.user["userid"];
  try {
    const data = await pool.query(
      "UPDATE user SET home=?, introduction=? WHERE user_id=?",
      [home, introduction, userid]
    );
    res.write(`<script>window.location="/profile/${userid}"</script>`);
    res.end();
  } catch (err) {
    console.error(err);
    res.write(
      `<script type="text/javascript">alert('Error Occur! Please rewrite the form!')</script>`
    );
    res.write('<script>window.location="/editProfile"</script>');
  }
});

module.exports = router;
