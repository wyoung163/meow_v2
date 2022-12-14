const express = require("express");
const pool = require("../db.js");

exports.updateQuestion = async (req, res) => {
  const {post_num, user_id, qna_cont} = req.body;

  const connection = await pool.getConnection(async (conn) => conn);
  const result = await connection.query(
    `insert into qna(post_num, user_id, qna_cont) 
    values(?, ?, ?)`,
    [post_num, user_id, qna_cont]
  );

  if (result[0].affectedRows == 1) {
    res.write(
      `<script type="text/javascript">alert('Complete to write question!')</script>`
    );
    res.write(`<script>location.href = '/OtherBoard/${post_num}'</script>`);
  } else {
    res.write(
      `<script type="text/javascript">alert('Fail to write question!')</script>`
    );
    res.write(`<script>location.href = '/OtherBoard/${post_num}'</script>`);
  }

  connection.release();
};

exports.updateAnswer = async (req, res) => {
  const post_num = req.body.post_num;
  const qna_num = req.body.qna_num;
  const qna_ans = req.body.qna_ans;

  const connection = await pool.getConnection(async (conn) => conn);
  for (var i = 0; i < qna_num.length; i++) {
    var result = await connection.query(
      `UPDATE qna set qna_ans = ? WHERE qna_num = ?`,
      [qna_ans, qna_num]
    );
  }
  if (result[0].affectedRows == 1) {
    res.write(
      `<script type="text/javascript">alert('Complete to write answer!')</script>`
    );
    res.write(`<script>location.href = '/MyBoard/${post_num}'</script>`);
  } else {
    res.write(
      `<script type="text/javascript">alert('Fail to write answer!')</script>`
    );
    res.write(`<script>location.href = '/MyBoard/${post_num}'</script>`);
  }
  connection.release();
};

exports.deleteQuestion = async (req, res) => {
  const qna_num = req.body.qna_num;
  const post_num = req.body.post_num;
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await connection.query(
    "DELETE FROM qna WHERE qna_num = ?",
    qna_num
  );
  if (result[0].affectedRows == 1) {
    res.write(
      `<script type="text/javascript">alert('Complete to delete answer!')</script>`
    );
    res.write(`<script>location.href = '/OtherBoard/${post_num}'</script>`);
  } else {
    res.write(
      `<script type="text/javascript">alert('Fail to delete answer!')</script>`
    );
    res.write(`<script>location.href = '/OtherBoard/${post_num}'</script>`);
  }
  connection.release();
};
