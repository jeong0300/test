const db = require("../models");
require("dotenv").config();

const Post = db.Post;

const modifyInfo = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findByPk(postId);

    if (!post) {
      return res.status(404).send("게시글을 찾을 수 없습니다.");
    }

    res.render("modify", { post, postContent: JSON.stringify(post.content) });
  } catch (err) {
    console.error(err);
    res.status(500).send("서버 오류");
  }
};

module.exports = { modifyInfo };
