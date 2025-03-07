require("dotenv").config();

const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const bodyParser = require("body-parser");

const mainRouter = require("./routes/mainRouter");
const userRouter = require("./routes/userRouter");
const categoryRouter = require("./routes/categoryRouter");
const postRouter = require("./routes/postRouter");
// const { upload } = require("./controllers/adminController");

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use("/static", express.static(path.join(__dirname, "static")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/postit", mainRouter);
app.use("/user", userRouter);
app.use("/category", categoryRouter);
app.use("/post", postRouter);

app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("main");
});

app.get("/get-kakao-api-key", (req, res) => {
  res.json({ kakaoApiKey: process.env.KAKAO_API_KEY });
});

// app.post("/upload", upload.single("files"), (req, res) => {
//   res.json({
//     imageUrl: `/uploads/${req.file.filename}`,
//     title: req.body.title,
//   });
// });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
