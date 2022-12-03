const express = require("express");
const pool = require("../db.js");
const bcrypt = require("bcrypt");

exports.findThroughPlace = async (req, res) => {
  const userid = req.session.user["userid"];
  const nickname = req.session.user["nickname"];

  res.render("board/findBoard", {
    title: "장소로 찾는 게시글",
    userid: userid,
    nickname: nickname,
  });
};

exports.showBoardsOfPlace = async (req, res) => {
  const userid = req.session.user["userid"];
  const nickname = req.session.user["nickname"];

  const place_name = req.body.placeName;
  const place_loc = req.body.placeLoc;

  try {
    let result;
    let check;

    result = await pool.query(
      `SELECT place_num FROM place WHERE place_name = ? and place_loc=?`,
      [place_name, place_loc]
    );
    console.log(result[0][0]);

    check = await pool.query(`SELECT post_num FROM post WHERE place_num = ?`, [
      result[0][0].place_num,
    ]);

    if (check[0][0] != undefined) {
      let result2;
      result2 = await pool.query(
        `SELECT post_num, place_photo, user_id FROM post WHERE place_num = ?`,
        [result[0][0].place_num]
      );

      var postNum = [];
      var placePhoto = [];
      var userID = []; //게시자와 로그인한 사용자가 일치하는지 확인하기 위한 변수

      for (var data of result2[0]) {
        postNum.push(data.post_num);
        placePhoto.push(data.place_photo);
        userID.push(data.user_id);
      }

      res.render("board/searchLocBoards", {
        title: "장소로 찾는 게시글",
        userid: userid,
        nickname: nickname,
        postNum: postNum,
        placePhoto: placePhoto,
        place_name: place_name,
        place_loc: place_loc,
        userID: userID,
      });
    } else {
      res.write(
        `<script type="text/javascript">alert('No posts exist for this place!')</script>`
      );
      res.write('<script>window.location="/findThroughPlace"</script>');
    }
  } catch (err) {
    console.error(err);
    res.write(
      `<script type="text/javascript">alert('Fail to find posts for this place!')</script>`
    );
    res.write('<script>window.location="/findThroughPlace"</script>');
    res.end();
  }
};
