const express = require("express");
const pool = require("../db.js");
const bcrypt = require("bcrypt");

//회원 탈퇴
exports.showDelete = async (req, res, next) => {
  const userid = req.params.user_id;
  res.render("User/withdrawform", {title: "회원 탈퇴", userid: userid});
};

exports.updateDelete = async (req, res, next) => {
  const userid = req.session.user["userid"];
  const password = req.body.password;
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    const pwd = await connection.query(
      "SELECT password FROM user WHERE user_id = ?",
      [userid]
    );
    if (bcrypt.compareSync(password, pwd[0][0].password)) {
      const result = await connection.query(
        "DELETE FROM user WHERE user_id = ?",
        [userid]
      );
      if (result[0].affectedRows == 1) {
        req.session.destroy((err) => {
          if (err) throw err;
          else {
            res.write(
              `<script type="text/javascript">alert('Complete to delete your info!')</script>`
            );
            res.write('<script>window.location="/"</script>');
          }
        });
      }
    } else {
      res.write(
        `<script type="text/javascript">alert('Fail to delete: please enter again!')</script>`
      );
      res.write('<script>window.location="/withdraw"</script>');
    }
  } catch (err) {
    console.error(err);
  }
};
