const express = require("express");
const router = express.Router();
const pool = require("../db.js");
const session = require("express-session");

//bcrypt 추가로 비밀번호 암호화하기

router.get("/addBoard", async (req, res, next) => {
  const userid = req.session.user["userid"];
  const nickname = req.session.user["nickname"];
  const data = await pool.query(`SELECT * from tag`);
  const data4 = await pool.query(
    `SELECT DISTINCT menu_name from menu ORDER BY menu_name`
  );

  res.render("board/addBoard", {
    title: "게시글 작성",
    userid: userid,
    nickname: nickname,
    tags: data[0],
    menus: data4[0],
  });
});

//이미지 업로드
const multer = require("multer");
const path = require("path");
const e = require("express");

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
//이미지 업로드 끝

router.post(
  "/addBoard",
  upload.fields([{name: "place_photo"}, {name: "receipt_photo"}]),
  async (req, res, next) => {
    const post = req.body;
    const place_name = post.placeName;
    let place_loc = post.placeLoc;
    const menuname_select = post.menuname_select;
    let menu_name = post.menu_name;
    const price = post.price;

    const place_satisfy = post.place_satisfy;
    var tag_num = post.tag_num;
    const tag_cont = post.tag_cont;
    const review_cont1 = post.review_cont1;
    const review_cont2 = post.review_cont2;
    const review_cont3 = post.review_cont3;
    const place_photo = `/images/${req.files.place_photo[0].filename}`;
    const receipt_photo = `/images/${req.files.receipt_photo[0].filename}`;

    const title = "Meow";
    const nickname = req.session.user["nickname"];

    var resPostId;
    var resRevID;
    let placeId; //place_num
    try {
      let data;
      let check;

      check = await pool.query(
        `SELECT * FROM place WHERE place_name = ? and place_loc=?`, //이미 저장된 장소인지 확인
        [place_name, place_loc]
      );

      if (check[0][0] == undefined) {
        data = await pool.query(
          `INSERT INTO place(place_name, place_loc) VALUES (?, ?)`,
          [place_name, place_loc]
        );
        placeId = data[0].insertId;
      } else {
        placeId = check[0][0].place_num;
      }

      let data2;
      let check2;
      //메뉴 옵션에서 메뉴 이름 선택했을 때
      if (menuname_select != 0) {
        check2 = await pool.query(
          `SELECT menu_name FROM menu WHERE place_num = ? and menu_name = ?`, //동일한 장소의 동일한 메뉴 이름이 이미 존재하는지 확인
          [placeId, menuname_select]
        );

        //동일 장소의 동일 메뉴가 없다면 새로 저장
        if (check2[0].length <= 0) {
          data2 = await pool.query(
            `INSERT INTO menu(menu_name, price, place_num) VALUES (?, ?, ?)`,
            [menuname_select, price, placeId]
          );
        }
      } else {
        //메뉴 이름을 직접 입력했을 때
        check2 = await pool.query(
          `SELECT menu_name FROM menu WHERE place_num = ? and menu_name = ?`, //동일한 장소의 동일한 메뉴 이름이 이미 존재하는지 확인
          [placeId, menu_name]
        );
        //동일 장소의 동일 메뉴가 없다면 새로 저장
        if (check2[0].length <= 0)
          data2 = await pool.query(
            `INSERT INTO menu(menu_name, price, place_num) VALUES (?, ?, ?)`,
            [menu_name, price, placeId]
          );
      }

      if (menuname_select != 0) {
        menu_name = menuname_select;
      }

      const tag_search = await pool.query(
        `SELECT tag_num FROM tag WHERE tag_num = ?`,
        [tag_num]
      );
      var tag_num = tag_search[0][0].tag_num;

      const data4 = await pool.query(
        `INSERT INTO post(receipt_photo, place_photo, place_satisfy, place_num, view_count, user_id, tag_num, menu_name) VALUES (?, ?, ?, ?, 0, ?, ?, ?)`,
        [
          receipt_photo,
          place_photo,
          place_satisfy,
          placeId,
          req.session.user["userid"],
          tag_num,
          menu_name,
        ]
      );

      resPostId = data4[0].insertId; //삽입한 데이터의 id 받아오기

      const data5 = await pool.query(
        `INSERT INTO shortreview(post_num, review_cont1, review_cont2, review_cont3) VALUES (?, ?, ?, ?)`,
        [resPostId, review_cont1, review_cont2, review_cont3]
      );

      resRevID = data5[0].insertId;

      res.write('<script>window.location="/"</script>');
      res.end();
    } catch (err) {
      console.error(err);
      res.write(
        `<script type="text/javascript">alert('This review already exist!')</script>`
      );
      res.write('<script>window.location="/addBoard"</script>');
      res.end();
    }
  }
);

module.exports = router;
