const express = require("express");
const pool = require("../db.js");

exports.showDeleteBoard = async (req, res, next) => {
  const post_num = req.body;
  try {
    const data1 = await pool.query(
      "SELECT place_num, menu_name, place_satisfy, tag_num, place_photo, receipt_photo FROM post WHERE post_num = ?",
      [post_num]
    );
  } catch (err) {
    console.error(err);
  }
};

exports.deleteBoard = async (req, res) => {
  const post_num = req.body.post_num;
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await connection.query("DELETE FROM post WHERE post_num = ?", [
    post_num,
  ]);
  if (result[0].affectedRows == 1) {
    res.write(
      `<script type="text/javascript">alert('Complete to delete board!')</script>`
    );
    res.write(`<script>location.href = '/'</script>`);
  } else {
    res.write(
      `<script type="text/javascript">alert('Fail to delete board!')</script>`
    );
    res.write(`<script>location.href = '/'</script>`);
  }
  connection.release();
};
