const express = require("express");
const router = express.Router();
const pool = require("../db.js");
const bcrypt = require("bcrypt");

//게시글 작성 수정
router.get("/editBoard", async (req, res, next) => {
  const userid = req.session.user["userid"];
  var postID = req.query.post_num; //선택 받은 게시글 번호 지정

  try {
    const data = await pool.query(
      `SELECT * FROM post as po JOIN shortreview as sr ON po.post_num = sr.post_num 
        JOIN place as pl ON po.place_num = pl.place_num 
        JOIN tag as t ON po.tag_num = t.tag_num 
        JOIN menu as m ON pl.place_num = m.place_num and po.menu_name = m.menu_name
        WHERE po.post_num = ?`,
      [postID]
    );

    const data2 = await pool.query(`SELECT * from tag`);
    const data3 = await pool.query(
      `SELECT DISTINCT menu_name from menu WHERE place_num = ? ORDER BY menu_name`,
      [data[0][0].place_num]
    );

    res.render("board/updateBoardform", {
      title: "게시글 수정",
      post: data[0][0],
      tags: data2[0],
      menus: data3[0],
    });
  } catch (err) {
    console.error(err);
  }
});

//이미지 업로드
const multer = require("multer");
const path = require("path");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images/");
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname); // 파일 확장자
    const timestamp = new Date().getTime().valueOf(); // 현재 시간
    // 새 파일명(기존파일명 + 시간 + 확장자)
    const filename = path.basename(file.originalname, ext) + timestamp + ext;
    cb(null, filename);
  },
});

var upload = multer({storage: storage});

router.post(
  "/editBoard",
  upload.fields([{name: "place_photo"}, {name: "receipt_photo"}]),
  async (req, res, next) => {
    const post = req.body;
    const postID = post.post_num;
    const place_name = post.placeName;
    let place_loc = post.placeLoc;
    const menuname_select = post.menuname_select;
    let menu_name = post.menu_name;
    const price = post.price;
    const place_num = post.place_num;

    const place_satisfy = post.place_satisfy;
    var tag_num = post.tag_num;
    const tag_cont = post.tag_cont;
    const post_tag_cont = post.post_tag_cont;
    const review_num = post.review_num;
    const review_cont1 = post.review_cont1;
    const review_cont2 = post.review_cont2;
    const review_cont3 = post.review_cont3;
    const place_photo = `/images/${req.files.place_photo[0].filename}`;
    const receipt_photo = `/images/${req.files.receipt_photo[0].filename}`;

    const userid = req.session.user["userid"];

    try {
      let data;
      let check;
      let placeID;
      let check2;
      let data2;

      check = await pool.query(
        `SELECT * FROM place WHERE place_name = ? and place_loc=?`, //이미 저장된 장소인지 확인
        [place_name, place_loc]
      );

      if (check[0][0] == undefined) {
        data = await pool.query(
          `INSERT INTO place(place_name, place_loc) VALUES (?, ?)`,
          [place_name, place_loc]
        );
        placeID = data[0].insertId;
      } else {
        placeID = check[0][0].place_num;
      }

      if (menuname_select != 0) {
        const existMenu = await pool.query(
          // 만약에 수정한 메뉴 이름이 이미 존재한다면 냅두고
          `SELECT * FROM menu WHERE place_num=? and menu_name =? `,
          [place_num, menuname_select]
        );

        if (existMenu[0][0] == undefined) {
          const data2 = await pool.query(
            `INSERT INTO menu(menu_name, price, place_num) VALUES (?, ?, ?)`,
            [menuname_select, price, placeID] //선택된 메뉴랑 장소번호에 해당하는 데이터를 업데이트
          );
        }
      } else {
        check2 = await pool.query(
          `SELECT * FROM menu WHERE place_num = ? and menu_name = ?`, //동일한 장소의 동일한 메뉴 이름이 이미 존재하는지 확인
          [placeID, menu_name]
        );
        //동일 장소의 동일 메뉴가 없다면 새로 저장
        if (check2[0][0] == undefined)
          data2 = await pool.query(
            `INSERT INTO menu(menu_name, price, place_num) VALUES (?, ?, ?)`,
            [menu_name, price, placeID]
          );
      }

      if (menuname_select != 0) {
        menu_name = menuname_select;
      }

      if (tag_num == "0") {
        const existTag = await pool.query(
          `SELECT tag_num FROM tag WHERE tag_cont = ?`,
          [post_tag_cont]
        );
        tag_num = existTag[0][0].tag_num;
      } else {
        const tag_search = await pool.query(
          `SELECT tag_num FROM tag WHERE tag_num = ?`,
          [tag_num]
        );
        tag_num = tag_search[0][0].tag_num;
      }

      const data3 = await pool.query(
        "UPDATE post SET receipt_photo=?, place_photo=?, place_satisfy=?, place_num=?, user_id=?, menu_name=?, tag_num=? WHERE post_num=?",
        [
          receipt_photo,
          place_photo,
          place_satisfy,
          placeID,
          req.session.user["userid"],
          menu_name,
          tag_num,
          postID,
        ]
      );

      const data4 = await pool.query(
        "UPDATE shortreview SET review_cont1=?, review_cont2=?, review_cont3=? WHERE review_num=?",
        [review_cont1, review_cont2, review_cont3, review_num]
      );

      res.write(`<script>location.href = '/MyBoard/${postID}'</script>`);
      res.end();
    } catch (err) {
      console.error(err);
      res.write(
        `<script type="text/javascript">alert('Error Occur! Please rewrite the form!')</script>`
      );
      res.write(`<script>location.href = '/MyBoard/${postID}'</script>`);
    }
  }
);

module.exports = router;
