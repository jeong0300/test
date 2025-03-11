const db = require("../models");
require("dotenv").config();

const Category = db.Category;
const Post = db.Post;
const Like = db.Like;

// 모든 카테고리
const getAllCategories = async (req, res) => {
  try {
    let categories = await Category.findAll({});
    res.status(200).json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "카테고리 조회 실패", error: err.message });
  }
};

// 카테고리별로 이동
const getPostByCategoryId = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;

    const category = await Category.findOne({ where: { id: categoryId } });

    if (!category) {
      return res.status(404).json({ message: "존재하지 않는 카테고리입니다." });
    }

    const posts = await Post.findAll({
      where: { category_id: categoryId },
      attributes: [
        "id",
        "title",
        "content",
        "image_url",
        "createdAt",
        [db.sequelize.fn("COUNT", db.sequelize.col("Likes.id")), "like_count"],
      ],
      include: [
        {
          model: Like,
          attributes: [],
        },
      ],
      group: ["Post.id"],
      order: [["createdAt", "DESC"]],
    });

    if (!posts) {
      return res.status(404).json({ message: "게시글 조회 실패" });
    }

    const modifiedPosts = posts.map((post) => ({
      ...post.toJSON(),
      content: post.content.replace(/<[^>]*>/g, ""),
    }));

    res.render("category", {
      categoryName: category.name,
      posts: modifiedPosts,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "게시글 조회 실패", error: err.message });
  }
};

module.exports = {
  getAllCategories,
  getPostByCategoryId,
};
