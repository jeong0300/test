const db = require("../models");
require("dotenv").config();

const Post = db.Post;
const User = db.User;
const Category = db.Category;
const Like = db.Like;

// 글 작성
const createPost = async (req, res) => {
  try {
    const { user_id, category_id, title, content, image_url, like_count } =
      req.body;

    if (!user_id || !title || !content) {
      return res.status(400).json({ message: "필수 입력값이 누락되었습니다" });
    }

    const newPost = await Post.create({
      user_id,
      category_id,
      title,
      content,
      image_url,
      like_count,
    });

    res
      .status(200)
      .json({ message: "게시글이 작성되었습니다.", post: newPost });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "게시글 작성 실패", error: err.message });
  }
};

// 게시글 목록 조회 및 좋아요 개수
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [
        {
          model: Like,
          attribute: [],
        },
      ],
      attribute: {
        include: [
          [
            db.sequelize.fn("COUNT", db.sequelize.col("likes.id")),
            "like_count",
          ],
        ],
      },
      group: ["Post.id"],
    });
    res.status(200).json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "게시글 조회 실패", error: err.message });
  }
};

// 특정 게시글 조회 및 좋아요 개수 (id)
const getPostById = async (req, res) => {
  try {
    const { postId } = req.params.id;
    const post = await Post.findOne({
      where: { id: postId },
      include: [
        {
          model: Like,
          as: "likes",
        },
      ],
      attribute: {
        include: [
          [
            db.sequelize.fn("COUNT", db.sequelize.col("likes.id")),
            "like_count",
          ],
        ],
      },
      group: ["Post.id"],
    });

    if (!post) {
      return res.status(404).json({ message: "게시글 조회 실패" });
    }

    res.status(200).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "게시글 조회 실패", error: err.message });
  }
};

// 게시글 수정
const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, image_url } = req.body;

    const post = await Post.findOne({ where: { id: id } });

    if (!post) {
      return res.status(404).json({ message: "게시글 조회 실패" });
    }

    await Post.update({ title, content, image_url }, { where: { id: id } });

    res.status(200).json({ message: "게시글이 수정되었습니다" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "게시글 수정 실패", error: err.message });
  }
};

// 게시글 삭제
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findOne({ where: { id: id } });

    if (!post) {
      return res.status(404).json({ message: "게시글 조회 실패" });
    }

    await Post.destroy({ where: { id: id } });
    res.status(200).json({ message: "게시글이 삭제되었습니다" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "게시글 삭제 실패", error: err.message });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
};
