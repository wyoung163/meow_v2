const express = require("express");
const pool = require("../db");
const router = express.Router();

router.get("/", async (req, res) => {
  const title = "Meow";
  const profileRank = await pool.query(
    `SELECT user_id, name, nickname, age, gender, job, subs_num FROM user`
  );
  let rank3 = new Array(); //상위 3개 프로필 랭킹 보이기
  arrProfile = profileRank[0]; //subs_num만으로 정렬하기 위한 배열
  arrProfile.sort((a, b) => b.subs_num - a.subs_num); //오름차순 정렬
  if (arrProfile.length > 3) {
    for (let i = 0; i < 3; i++) {
      rank3[i] = arrProfile[i];
    }
  } else {
    rank3 = arrProfile; //프로필이 3개 이하일 때
  }

  const postRank = await pool.query(
    `SELECT post_num, place_photo, view_count, user_id, place_name FROM post as po JOIN place as pl ON po.place_num = pl.place_num`
  );
  let rank5 = new Array(); //상위 5개 게시글 랭킹 보이기
  arrPost = postRank[0]; //view_count만으로 정렬하기 위한 배열
  arrPost.sort((a, b) => b.view_count - a.view_count); //오름차순 정렬
  if (arrPost.length > 5) {
    for (let i = 0; i < 5; i++) {
      rank5[i] = arrPost[i];
    }
  } else {
    rank5 = arrPost; //게시글이 5개 이하일 때
  }

  if (req.session.user) {
    const nickname = req.session.user["nickname"];
    const userid = req.session.user["userid"];

    res.render("main", {
      title: title,
      nickname: nickname,
      userid: userid,
      rank5: rank5,
      rank3: rank3,
    });
  } else {
    res.render("loginMain", {
      title: title,
      rank3: rank3,
      rank5: rank5,
      userid: "null",
    });
  }
});

module.exports = router;
