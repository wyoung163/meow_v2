//프로필 백
const express = require("express");
const router = express.Router();
const pool = require("../db.js");

router.get("/profile/:userid", async (req, res, next) => {
  let nickname;
  // const myid = req.session.user["userid"];
  let notUser = false; //로그인 되어있는 경우
  let myid;
  //로그인 안했을 때 보이게 하기 위해서
  if (req.session.user) {
    myid = req.session.user["userid"];
    nickname = req.session.user["nickname"];
  } else {
    myid = "null";
    nickname = req.params.nickname;
    notUser = true; //로그인 되어있지 않은 경우
  } //else 지워도 되는지 확인해보기
  const userid = req.params.userid;

  let isUser; //로그인한 유저 = 해당 프로필 유저?
  let canSubs = false;
  let myPost; //내가 작성한 게시글
  let subscribe; //내가 구독한 사람
  let subscribe2; //내가 이 사람을 구독한 경우
  let scrapPic; //스크랩한 게시글 사진 가져오기
  let scrapPic1 = new Array(); //스크랩한 게시글 사진 띄우기

  if (userid == myid) isUser = true;
  else isUser = false;

  try {
    const data = await pool.query(
      "SELECT user_id, name, nickname, age, gender, job, home, introduction FROM user WHERE user_id = ?",
      [userid]
    );

    const data2 = await pool.query("SELECT * FROM qna WHERE user_id = ?", [
      userid,
    ]);

    //올린 게시물
    myPost = await pool.query(
      `SELECT post_num, place_photo FROM post WHERE user_id =?`,
      [userid]
    );
    if (myPost[0][0] == undefined) {
      myPost = "작성한 게시물이 없습니다.";
    }
    //구독
    subscribe = await pool.query(`SELECT * FROM subscribe WHERE user_id1 = ?`, [
      userid,
    ]);

    subscribe2 = await pool.query(
      `SELECT * FROM subscribe WHERE user_id1 = ? and user_id2 = ?`,
      [myid, userid]
    );

    if (subscribe[0][0] == undefined && isUser) {
      //만약 내 프로필인데 내가 구독한 사람이 없다면
      subscribe = "구독자가 없습니다.";
    } else if (isUser) {
      //내 프로필인데 구독한 사람이 있다면
      subscribe = subscribe[0];
      //user_id2가 구독 당한 사람(지수가 지수2를 구독했으면 지수: user_id1, 지수2: user_id2
    } else if (subscribe[0][0] == undefined) {
      //내 프로필이 아니면서 구독한 사람이 없으면서
      subscribe = "구독자가 없습니다.";

      if (subscribe2[0][0] != undefined) {
        // 본인은 구독을 당한 사람
        canSubs = true;
      }
    } else {
      //내 프로필이 아니면서 구독자가 있는데
      subscribe = subscribe[0];
      if (subscribe2[0][0] != undefined) {
        // 본인은 구독을 당한 사람
        canSubs = true;
      }
    }

    //스크랩
    let scrap = await pool.query(`SELECT * FROM scrap WHERE user_id =? `, [
      userid,
    ]);

    if (scrap[0][0] == undefined) {
      scrap = "스크랩한 게시글이 없습니다.";
    } else {
      for (let i = 0; i < scrap[0].length; i++) {
        scrapPic = await pool.query(
          `SELECT place_photo FROM post WHERE post_num = ?`,
          [scrap[0][i].post_num]
        );
        scrapPic1[i] = scrapPic[0][0].place_photo;
      }
    }

    res.render("User/profile", {
      title: "프로필",
      user: isUser,
      nickname: nickname,
      row: data[0][0],
      qnas: data2,
      myPost: myPost,
      canSubs: canSubs,
      subscribe: subscribe,
      scrap: scrap,
      scrapPic: scrapPic1,
      userid: userid,
      notUser: notUser,
      requestUser: req.session.user,
    });
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
