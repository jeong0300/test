require("dotenv").config();

const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const bodyParser = require("body-parser");

const mainRouter = require("./routes/mainRouter");
const userRouter = require("./routes/userRouter");
const categoryRouter = require("./routes/categoryRouter");

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use("/static", express.static(path.join(__dirname, "static")));

app.use("/postit", mainRouter);
app.use("/user", userRouter);
app.use("/category", categoryRouter);

app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("main");
});

app.get("/get-kakao-api-key", (req, res) => {
  res.json({ kakaoApiKey: process.env.KAKAO_API_KEY });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
