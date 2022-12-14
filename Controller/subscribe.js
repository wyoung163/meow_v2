const express = require("express");
const router = express.Router();
const pool = require("../db");

router.post("/subscribe", async (req, res, next) => {
  const nickname = req.session.user["nickname"];
  const myid = req.session.user["userid"];
  const userid = req.body.userid;

  try {
    //이미 구독한 사람인지 아닌지 확인
    const subscibe = await pool.query(
      `SELECT * FROM subscribe where user_id1 = ? and user_id2 = ?`,
      [myid, userid]
    );
    //로그인한 유저가 구독한 사람이 아니라면
    if (subscibe[0][0] == undefined) {
      const data = await pool.query(
        `INSERT INTO subscribe(user_id1, user_id2) VALUES(?, ?)`,
        [myid, userid]
      );
      //subscribe에 추가 후 해당 user의 구독자 수에 해당하는 column++
      let subs_add = await pool.query(
        `SELECT subs_num FROM user WHERE user_id = ?`,
        [userid]
      );
      let subs_num = subs_add[0][0].subs_num + 1;
      subs_add = await pool.query(
        `UPDATE user SET subs_num =? WHERE user_id =?`,
        [subs_num, userid]
      );
    } else {
      //로그인한 유저가 이미 구독한 사람이라면
      const data = await pool.query(
        `DELETE FROM subscribe WHERE user_id1 =? and user_id2 =?`,
        [myid, userid]
      );
      //subscribe에서 삭제 후(구독 취소) 해당 user의 구독자 수에 해당하는 column--
      let subs_del = await pool.query(
        `SELECT subs_num FROM user WHERE user_id = ?`,
        [userid]
      );
      let subs_num = subs_del[0][0].subs_num - 1;
      subs_del = await pool.query(
        `UPDATE user SET subs_num =? WHERE user_id =?`,
        [subs_num, userid]
      );
    }
    res.write(`<script>window.location="/profile/${userid}"</script>`);
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
