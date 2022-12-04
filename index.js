const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const ejs = require("ejs");
const multer = require("multer");
const upload = multer({dest: "./upload"});

const port = 3000;

app.set("view engine", "ejs");

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

app.listen(port);
console.log(`app is listening port ${port}`);
