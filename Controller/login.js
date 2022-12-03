//로그인 백
const express = require("express");
const router = express.Router();
const pool = require("../db.js");
const bcrypt = require("bcrypt");

router.get("/login", async (req, res, next) => {
  res.render("login", {title: "로그인"});
});

router.post("/login", async (req, res, next) => {
  const post = req.body;
  const user_id = post.id;
  const password = post.password;

  const data = await pool.query(`SELECT * FROM user where user_id= ?`, [
    user_id,
  ]);

  if (data[0][0] == undefined || data[0][0].password == undefined) {
    res.write(
      `<script type="text/javascript">alert('Wrong user_id or password!')</script>`
    );
    res.write('<script>window.location="/login"</script>');
  } else if (bcrypt.compareSync(password, data[0][0].password)) {

    //새로고침해도 로그아웃되지 않도록 세션 유지될 수 있게 nickname 저장하기
    req.session.user = {
      userid: data[0][0].user_id,
      nickname: data[0][0].nickname,
      is_logined: true,
      authorized: true,
    };
    res.write('<script>window.location="/"</script>');
    res.end();
  } else {
    res.write(
      `<script type="text/javascript">alert('Wrong user_id or password!')</script>`
    );
    res.write('<script>window.location="/login"</script>');
  }
});
module.exports = router;
