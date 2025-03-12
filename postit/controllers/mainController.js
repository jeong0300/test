// const products = require("../models/mainModel");
const db = require("../models");
var Sequelize = require("sequelize");
const Op = Sequelize.Op;
const Category = db.Category;
const Post = db.Post;

const moveUrl = (req, res) => {
  const url = req.params.url;
  res.render(url);
};

// 제목으로 검색
const searchTitle = async (req, res) => {
  const name = req.query.name;
  try {
    // 게시글 데이터 가져오기
    const post = await Post.findAll({
      where: {
        title: {
          [Op.like]: "%" + name + "%",
        },
      },
      attributes: [
        "id",
        "user_id",
        "title",
        "content",
        "image_url",
        "createdAt",
        "category_id",
        [
          db.sequelize.literal(
            "(SELECT COUNT(*) FROM Likes WHERE Likes.post_id = Post.id)"
          ),
          "like_count",
        ],
      ],
      include: [
        {
          model: Category,
          as: "Category",
          attributes: ["id", "name"],
        },
      ],
    });

    if (!post) {
      return res.status(404).json({ message: "게시글을 찾을 수 없습니다" });
    }
    res.render("searchPage", { name, posts: post });
  } catch (err) {
    console.error(err);
    res.status(500).render("error", {
      message: "서버 오류가 발생했습니다.",
      error: err.message,
    });
  }
};

module.exports = { moveUrl, searchTitle };
