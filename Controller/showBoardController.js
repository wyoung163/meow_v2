const express = require("express");
const pool = require("../db.js");
const bcrypt = require("bcrypt");

exports.showMyBoardList = async (req, res) => {
  const userid = req.session.user["userid"];
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await connection.query(
    `SELECT * FROM post as po JOIN place as pl ON po.place_num = pl.place_num 
    WHERE user_id = ?`,
    userid
  );

  const nickName = await connection.query(
    `SELECT nickname FROM user WHERE user_id = ?`,
    userid
  );

  var postNum = [];
  var placeName = [];
  var placePhoto = [];

  for (var data of result[0]) {
    postNum.push(data.post_num);
    placePhoto.push(data.place_photo);
    placeName.push(data.place_name);
  }

  console.log(postNum);

  res.render("board/showMyBoardList", {
    title: "나의 게시글 목록",
    userid: userid,
    nickname: nickName[0][0].nickname,
    postNum: postNum,
    placeName: placeName,
    placePhoto: placePhoto,
  });
};

exports.showMyBoard = async (req, res) => {
  const userid = req.session.user["userid"];
  const post_num = req.params.post_num;
  // console.log(userid, post_num);
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await connection.query(
    `SELECT * FROM post as po JOIN shortreview as sr ON po.post_num = sr.post_num 
  JOIN place as pl ON po.place_num = pl.place_num 
  JOIN tag as t ON po.tag_num = t.tag_num 
  JOIN menu as m ON pl.place_num = m.place_num and po.menu_name = m.menu_name
  WHERE po.post_num = ? `,
    [post_num]
  );

  const nickName = await connection.query(
    `SELECT nickname FROM user WHERE user_id = ?`,
    userid
  );

  const result2 = await connection.query(
    `SELECT * FROM shortreview as sr 
  JOIN satisfy as st ON sr.review_num = st.review_num
  WHERE sr.post_num = ?`,
    [post_num]
  );

  var pct1s = [];
  var pct2s = [];
  var pct3s = [];

  for (var data of result2[0]) {
    pct1s.push(data.s_pct1);
    pct2s.push(data.s_pct2);
    pct3s.push(data.s_pct3);
  }

  var sum1 = 0;
  var sum2 = 0;
  var sum3 = 0;

  for (var i = 0; i < pct1s.length; i++) {
    sum1 += pct1s[i];
    sum2 += pct2s[i];
    sum3 += pct3s[i];
  }

  const pct1 = sum1 / pct1s.length;
  const pct2 = sum2 / pct2s.length;
  const pct3 = sum3 / pct3s.length;

  const result3 = await connection.query(
    "SELECT qna_num, qna_cont, qna_ans, user_id FROM qna WHERE post_num = ?",
    [post_num]
  );

  var numList = [];
  var contList = [];
  var ansList = [];
  var userList = [];

  for (var data of result3[0]) {
    numList.push(data.qna_num);
    contList.push(data.qna_cont);
    ansList.push(data.qna_ans);
    userList.push(data.user_id);
  }

  res.render("board/showMyBoard", {
    title: "나의 게시글",
    title2: "Q&A",
    nickname: nickName[0][0].nickname,
    post_num: post_num,
    result: result[0][0],
    shortRSPct1: pct1.toFixed(1),
    shortRSPct2: pct2.toFixed(1),
    shortRSPct3: pct3.toFixed(1),
    userid: userid,
    users_id: userList,
    qna_num: numList,
    qna_cont: contList,
    qna_ans: ansList,
  });

  connection.release();
};

exports.showOtherBoardList = async (req, res) => {
  // const userid = req.session.user["userid"];
  let userid; //로그인 안했을 때 보이게 하기 위해서
  if (req.session.user) {
    userid = req.session.user["userid"];
  } else {
    userid = req.params.user_id;
  }
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await connection.query(
    `SELECT * FROM post as po JOIN place as pl ON po.place_num = pl.place_num`
  );

  let nickName;
  if (req.session.user) {
    nickName = await connection.query(
      `SELECT nickname FROM user WHERE user_id = ?`,
      [userid]
    );
  } else {
    nickName = "로그인 전입니다.";
  }

  var postNum = [];
  var placePhoto = [];
  var placeName = [];
  var postUser = [];

  for (var data of result[0]) {
    postNum.push(data.post_num);
    placePhoto.push(data.place_photo);
    placeName.push(data.place_name);
    postUser.push(data.user_id);
  }

  res.render("board/showOtherBoardList", {
    title: "모든 게시글 목록",
    userid: userid,
    nickname: nickName[0][0].nickname,
    postNum: postNum,
    placePhoto: placePhoto,
    placeName: placeName,
    post_userid: postUser,
    requestUser: req.session.user,
  });
};

exports.showOtherBoard = async (req, res, next) => {
  // try {
  let userid;
  if (req.session.user) {
    userid = req.session.user["userid"];
  } else {
    userid = req.params.user_id;
  }
  const post_num = req.params.post_num;

  const connection = await pool.getConnection(async (conn) => conn);

  const result = await connection.query(
    `SELECT * FROM post as po JOIN shortreview as sr ON po.post_num = sr.post_num 
JOIN place as pl ON po.place_num = pl.place_num 
JOIN tag as t ON po.tag_num = t.tag_num 
JOIN menu as m ON pl.place_num = m.place_num and po.menu_name = m.menu_name
WHERE po.post_num = ?`,
    [post_num]
  );

  const post_userid = result[0][0].user_id;

  let mynickName;
  if (req.session.user) {
    mynickName = await connection.query(
      `SELECT nickname FROM user WHERE user_id = ?`,
      [userid]
    );
  } else {
    mynickName = "로그인 전입니다.";
  }
  const post_user_nickName = await connection.query(
    `SELECT nickname FROM user WHERE user_id = ?`,
    [post_userid]
  );

  const result2 = await connection.query(
    `SELECT * FROM shortreview as sr 
    JOIN satisfy as st ON sr.review_num = st.review_num
    WHERE sr.post_num = ?`,
    [post_num]
  );

  var pct1s = [];
  var pct2s = [];
  var pct3s = [];

  for (var data of result2[0]) {
    pct1s.push(data.s_pct1);
    pct2s.push(data.s_pct2);
    pct3s.push(data.s_pct3);
  }

  var sum1 = 0;
  var sum2 = 0;
  var sum3 = 0;

  for (var i = 0; i < pct1s.length; i++) {
    sum1 += pct1s[i];
    sum2 += pct2s[i];
    sum3 += pct3s[i];
  }

  const pct1 = sum1 / pct1s.length;
  const pct2 = sum2 / pct2s.length;
  const pct3 = sum3 / pct3s.length;

  const result3 = await connection.query(
    "SELECT qna_num, qna_cont, qna_ans, user_id FROM qna WHERE post_num = ?",
    [post_num]
  );
  if (post_userid == userid) {
    //login 전 화면에서 session 접근 시 undefined 오류
    let mynickName;
    if (req.session.user) {
      mynickName = await connection.query(
        `SELECT nickname FROM user WHERE user_id = ?`,
        [userid]
      );
    } else {
      mynickName = "로그인하기 전입니다.";
    }

    var numList = [];
    var contList = [];
    var ansList = [];
    var userList = [];

    for (var data of result3[0]) {
      numList.push(data.qna_num);
      contList.push(data.qna_cont);
      ansList.push(data.qna_ans);
      userList.push(data.user_id);
    }

    res.render("board/showMyBoard", {
      title: "나의 게시글",
      title2: "Q&A",
      nickname: mynickName[0][0].nickname,
      post_num: post_num,
      result: result[0][0],
      shortRSPct1: pct1.toFixed(1),
      shortRSPct2: pct2.toFixed(1),
      shortRSPct3: pct3.toFixed(1),
      userid: userid,
      users_id: userList,
      qna_num: numList,
      qna_cont: contList,
      qna_ans: ansList,
    });
  } else {
    var mynumList = [];
    var numList = [];
    var mycontList = [];
    var contList = [];
    var myansList = [];
    var ansList = [];
    var userList = [];

    //본인 게시글 아닐 때에만 조회했을 때 view_count 증가되도록
    let inq = await connection.query(
      `UPDATE post SET view_count=? WHERE post_num =?`,
      [++result[0][0].view_count, post_num]
    ); //조회

    let scrap = await connection.query(
      "SELECT * FROM scrap WHERE user_id = ? AND post_num = ?",
      [userid, post_num]
    );
    if (scrap[0][0] == undefined) {
      scrap = true;
    } else {
      scrap = false;
    }

    for (var data of result3[0]) {
      if (data.user_id == userid) {
        mynumList.push(data.qna_num);
        mycontList.push(data.qna_cont);
        myansList.push(data.qna_ans);
      } else {
        numList.push(data.qna_num);
        contList.push(data.qna_cont);
        ansList.push(data.qna_ans);
        userList.push(data.user_id);
      }
    }

    res.render("board/showOtherBoard", {
      title: "게시글",
      title2: "Q&A",
      nickname: mynickName[0][0].nickname,
      post_num: post_num,
      result: result[0][0],
      shortRSPct1: pct1.toFixed(1),
      shortRSPct2: pct2.toFixed(1),
      shortRSPct3: pct3.toFixed(1),
      userid: userid,
      users_id: userList,
      post_userid: post_userid,
      qna_num: numList,
      qna_cont: contList,
      qna_ans: ansList,
      myqna_num: mynumList,
      myqna_cont: mycontList,
      myqna_ans: myansList,
      pu_nickname: post_user_nickName[0][0].nickname,
      scrap: scrap,
      requestUser: req.session.user,
    });
  }
  connection.release();
};

exports.addSatisfaction = async (req, res) => {
  const user_id = req.session.user["userid"];
  const review_num = req.body.review_num;
  const post_num = req.body.post_num;
  var pct = [];
  pct.push(req.body.mys_pct1);
  pct.push(req.body.mys_pct2);
  pct.push(req.body.mys_pct3);

  const connection = await pool.getConnection(async (conn) => conn);
  const check = await connection.query(
    `SELECT s_num, user_id, s_pct1, s_pct2, s_pct3 FROM satisfy WHERE post_num = ? and review_num = ? and user_id = ?`,
    [post_num, review_num, user_id]
  );

  var get_pct = [];

  if (check[0].length > 0) {
    get_pct.push(check[0][0].s_pct1);
    get_pct.push(check[0][0].s_pct2);
    get_pct.push(check[0][0].s_pct3);

    for (var i = 0; i < 3; i++) {
      if (pct[i] > 0) {
        if (get_pct[i] <= 0) {
          if (i == 0) {
            var change = await connection.query(
              `UPDATE satisfy SET s_pct1 = ? where s_num = ?`,
              [pct[0], check[0][0].s_num]
            );
          } else if (i == 1) {
            var change = await connection.query(
              `UPDATE satisfy SET s_pct2 = ? where s_num = ?`,
              [pct[1], check[0][0].s_num]
            );
          } else {
            var change = await connection.query(
              `UPDATE satisfy SET s_pct3 = ? where s_num = ?`,
              [pct[2], check[0][0].s_num]
            );
          }
          if (change[0].affectedRows == 1) {
            res.write(
              `<script type="text/javascript">alert('Complete to add satisfaction!')</script>`
            );
            res.write(
              `<script>location.href = '/OtherBoard/${post_num}'</script>`
            );
          }
        } else {
          res.write(
            `<script type="text/javascript">alert('Already add satisfaction!')</script>`
          );
          res.write(
            `<script>location.href = '/OtherBoard/${post_num}'</script>`
          );
        }
      }
    }
  } else {
    for (var i = 0; i < 3; i++) {
      if (pct[i] == "") {
        pct[i] = null;
      }
    }
    const result = await connection.query(
      `INSERT INTO satisfy(s_pct1, s_pct2, s_pct3, user_id, post_num, review_num)
      VALUES(?, ?, ?, ?, ?, ?)`,
      [pct[0], pct[1], pct[2], user_id, post_num, review_num]
    );

    if (result[0].affectedRows == 1) {
      res.write(
        `<script type="text/javascript">alert('Complete to add satisfaction!')</script>`
      );
      res.write(`<script>location.href = '/OtherBoard/${post_num}'</script>`);
    }
  }
  connection.release();
};
