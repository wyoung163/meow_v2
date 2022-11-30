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
const signup = require("./controllers/signup");
app.get("/signup", signup);
app.post("/signup", signup);
//login and logout
const login = require("./controllers/login");
const logout = require("./controllers/logout");
app.get("/login", login);
app.post("/login", login);
app.get("/logout", logout);


app.listen(port);
console.log(`app is listening port ${port}`);
