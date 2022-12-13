const express = require("express");
const router = express.Router();
const pool = require("../db.js");

router.get("/addTag", async (req, res, next) => {
  const userid = req.session.user["userid"];
  let tag_list = new Array();
  const nickname = req.session.user["nickname"];
  try {
    const data = await pool.query(`SELECT * FROM tag`);
    if (data[0][0] == undefined) {
      tag_list = "태그가 존재하지 않습니다.";
    } else {
      try {
        let count = await pool.query(`SELECT count(*) FROM tag`);
        count = count[0][0]["count(*)"];
        for (let i = 0; i < count; i++) {
          tag_list[i] = data[0][i].tag_cont;
        }
      } catch (err) {
        console.error(err);
      }
    }
  } catch (err) {
    console.error(err);
  }
  res.render("tag", {
    title: "태그추가",
    nickname: nickname,
    tag_list: tag_list,
    userid: userid,
  });
});

router.post("/addTag", async (req, res, next) => {
  const post = req.body;
  const tag_cont = post.tag;

  try {
    const data = await pool.query(`SELECT * FROM tag where tag_cont=?;`, [
      tag_cont,
    ]);
    if (data[0][0] != undefined) {
      console.log("이미 존재하는 태그");
      res.write(
        //만약 db에 이미 존재하는 태그라면
        `<script type="text/javascript">alert('This Tag is already exist!')</script>`
      );
      res.write('<script>window.location="/addTag"</script>');
    } else {
      try {
        const tag_input = pool.query(`INSERT INTO tag(tag_cont) VALUES(?)`, [
          tag_cont,
        ]);
        res.write('<script>window.location="/addTag"</script>');
      } catch (err) {
        console.error(err);
      }
    }
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
