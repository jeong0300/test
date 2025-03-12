require("dotenv").config();

const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const mainRouter = require("./routes/mainRouter");
const userRouter = require("./routes/userRouter");
const categoryRouter = require("./routes/categoryRouter");
const postRouter = require("./routes/postRouter");
const likeRouter = require("./routes/likeRouter");
const modifyRouter = require("./routes/modifyRouter");
const postController = require("./controllers/postController");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

app.use("/static", express.static(path.join(__dirname, "static")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/postit", mainRouter);
app.use("/user", userRouter);
app.use("/category", categoryRouter);
app.use("/post", postRouter);
app.use("/like", likeRouter);
app.use("/modify", modifyRouter);

app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

// app.get("/", async (req, res) => {
//   const page = parseInt(req.query.page) || 1;
//   const limit = parseInt(req.query.limit) || 10;

//   try {
//     const posts = await postController.getAllPosts(page, limit);
//     res.render("main", { posts });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "서버 오류 발생" });
//   }
// });

app.get("/", async (req, res) => {
  try {
    const posts = await postController.getAllPosts();
    res.render("main", { posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "서버 오류 발생" });
  }
});

app.get("/get-kakao-api-key", (req, res) => {
  res.json({ kakaoApiKey: process.env.KAKAO_API_KEY });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
