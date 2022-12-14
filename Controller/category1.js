//카테고리 백
const express = require("express");
const router = express.Router();
const pool = require("../db.js");

router.get("/category1", async (req, res, next) => {
  const userid = req.session.user["userid"];
  const nickname = req.session.user["nickname"];

  try {
    const data1 = await pool.query(
      "SELECT post_num, place_photo, place_name FROM post as po JOIN place as pl ON po.place_num = pl.place_num WHERE user_id IN (SELECT user_id From user WHERE age = 10)"
    );
    const data2 = await pool.query(
      "SELECT post_num, place_photo, place_name FROM post as po JOIN place as pl ON po.place_num = pl.place_num WHERE user_id IN (SELECT user_id From user WHERE age = 20)"
    );
    const data3 = await pool.query(
      "SELECT post_num, place_photo, place_name FROM post as po JOIN place as pl ON po.place_num = pl.place_num WHERE user_id IN (SELECT user_id From user WHERE age = 30)"
    );
    const data4 = await pool.query(
      "SELECT post_num, place_photo, place_name FROM post as po JOIN place as pl ON po.place_num = pl.place_num WHERE user_id IN (SELECT user_id From user WHERE age = 40)"
    );
    const data5 = await pool.query(
      "SELECT post_num, place_photo, place_name FROM post as po JOIN place as pl ON po.place_num = pl.place_num WHERE user_id IN (SELECT user_id From user WHERE age = 50)"
    );
    const data6 = await pool.query(
      "SELECT post_num, place_photo, place_name FROM post as po JOIN place as pl ON po.place_num = pl.place_num WHERE user_id IN (SELECT user_id From user WHERE age = 60)"
    );

    res.render("Category/category1", {
      title: "카테고리",
      nickname: nickname,
      userid: userid,
      data1: data1[0],
      data2: data2[0],
      data3: data3[0],
      data4: data4[0],
      data5: data5[0],
      data6: data6[0],
    });
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
