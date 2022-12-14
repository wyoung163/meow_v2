const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const ejs = require("ejs");
const multer = require("multer");
const upload = multer({dest: "./upload"});

const port = 5000;

app.set("view engine", "ejs");
app.set("views", "View");


app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(express.json());
app.use(express.static("public"));

//로그인 후 세션 유지를 위한 코드
app.use(
  session({
    secret: "my key",
    resave: false,
    saveUninitialize: true,
  })
);

//main
const main = require("./Controller/main");
app.use("/", main);
//sing up
const signup = require("./Controller/signup");
app.get("/signup", signup);
app.post("/signup", signup);
//login and logout
const login = require("./Controller/login");
const logout = require("./Controller/logout");
app.get("/login", login);
app.post("/login", login);
app.get("/logout", logout);
//user
const editUser = require("./Controller/editController");
const deleteUser = require("./Controller/deleteController");
app.get("/edit", editUser.showEdit);
app.post("/edit", editUser.updateEdit);
app.get("/withdraw", deleteUser.showDelete);
app.post("/withdraw", deleteUser.updateDelete);
//profile
const profile = require("./Controller/profile");
const addProfile = require("./Controller/addProfile");
const editProfile = require("./Controller/editProfile");
app.get("/profile/:userid", profile);
app.get("/addProfile", addProfile);
app.post("/addProfile", addProfile);
app.get("/editProfile", editProfile);
app.post("/editProfile", editProfile);
//post
const addBoard = require("./Controller/addBoard");
const editBoard = require("./Controller/editBoard");
const showBoard = require("./Controller/showBoardController");
const findBoard = require("./Controller/findBoardController");
const deleteBoard = require("./Controller/deleteBoard");
app.get("/addBoard", addBoard);
app.post("/addBoard", addBoard);
app.get("/editBoard", editBoard);
app.post("/editBoard", editBoard);
app.get("/MyBoardList", showBoard.showMyBoardList);
app.get("/MyBoard/:post_num", showBoard.showMyBoard);
app.post("/MyBoard/:post_num", showBoard.showMyBoard);
app.get("/MyBoard/:post_num/delete", deleteBoard.showDeleteBoard);
app.post("/MyBoard/:post_num/delete", deleteBoard.deleteBoard);
app.get("/OtherBoardList", showBoard.showOtherBoardList);
app.get("/OtherBoard/:post_num", showBoard.showOtherBoard);
app.post("/OtherBoard/:post_num", showBoard.showOtherBoard);
//qna
const writeQnA = require("./Controller/qnaController");
app.post("/qna/Q", writeQnA.updateQuestion);
app.post("/qna/A", writeQnA.updateAnswer);
app.post("/qna/delete", writeQnA.deleteQuestion);
//category
const category1 = require("./Controller/category1");
const category2 = require("./Controller/category2");
const category3 = require("./Controller/category3");
app.get("/category1", category1);
app.get("/category2", category2);
app.get("/category3", category3);
//scrap
const scrap = require("./Controller/scrap");
app.post("/scrap", scrap);
//subscribe
const subscribe = require("./Controller/subscribe");
app.post("/subscribe", subscribe);
//tag
const addTag = require("./Controller/tag");
app.get("/addTag", addTag);
app.post("/addTag", addTag);

app.listen(port);
console.log(`app is listening port ${port}`);
