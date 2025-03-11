const db = require("../models");
require("dotenv").config();

const jwt = require("jsonwebtoken");

const User = db.User;
const Post = db.Post;
const Like = db.Like;
const Category = db.Category;

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

// 모든 게시글 조회 및 좋아요 개수
const getAllPosts = async () => {
  try {
    const posts = await Post.findAll({
      attributes: [
        "id",
        "user_id",
        "category_id",
        "title",
        "content",
        "image_url",
        "createdAt",
        "updatedAt",
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

    const modifiedPosts = posts.map((post) => ({
      ...post.toJSON(),
      content: post.content.replace(/<[^>]*>/g, ""),
    }));

    return modifiedPosts;
  } catch (err) {
    console.error(err);
    return [];
  }
};

// 특정 게시글(카테고리명별로) 조회 및 좋아요 개수 (id)
// const getPostById = async (req, res) => {
//   try {
//     const { categoryName, postId } = req.params;
//     const token = req.headers.authorization?.split(" ")[1];
//     console.log("Authorization 헤더:", req.headers.authorization);
//     console.log("추출된 토큰:", token);
//     let userId = null;

//     if (token) {
//       try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         userId = decoded.id;
//         console.log("디코딩된 userId:", userId);
//       } catch (err) {
//         console.error("토큰 검증 실패:", err);
//       }
//     } else {
//       console.warn("토큰이 없습니다.");
//     }

//     const post = await Post.findOne({
//       where: { id: postId },
//       attributes: [
//         "id",
//         "user_id",
//         "title",
//         "content",
//         "image_url",
//         "createdAt",
//         "category_id",
//         [
//           db.sequelize.literal(
//             "(SELECT COUNT(*) FROM Likes WHERE Likes.post_id = Post.id)"
//           ),
//           "like_count",
//         ],
//       ],
//       include: [
//         {
//           model: Category,
//           as: "Category",
//           attributes: ["id", "name"],
//         },
//       ],
//     });

//     if (!post) {
//       return res.status(404);
//     }

//     console.log("요청한 사용자 ID:", userId);
//     console.log("게시글 작성자 ID:", post.user_id);

//     const modifiedPost = {
//       ...post.toJSON(),
//       content: post.content.replace(/<\/?p[^>]*>/g, ""),
//     };

//     res.render("postDetail", { modifiedPost, categoryName, userId });
//   } catch (err) {
//     console.error(err);
//     res.status(500).render("error", {
//       message: "서버 오류가 발생했습니다.",
//       error: err.message,
//     });
//   }
// };

const getPostById = async (req, res) => {
  try {
    const { categoryName, postId } = req.params;
    const token = req.cookies.token;
    let currentUserId = null;

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        currentUserId = decoded.userId;
      } catch (err) {
        console.error("토큰 검증 실패:", err);
      }
    }

    // 게시글 데이터 가져오기
    const post = await Post.findOne({
      where: { id: postId },
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

    res.render("postDetail", {
      modifiedPost: post,
      categoryName,
      currentUserId,
      postId: post.user_id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).render("error", {
      message: "서버 오류가 발생했습니다.",
      error: err.message,
    });
  }
};

// 내 글 보기
const getMyPost = async (req, res) => {
  try {
    const { userId } = req.params;

    const posts = await Post.findAll({
      where: { user_id: userId },
      attributes: [
        "id",
        "title",
        "content",
        "image_url",
        "createdAt",
        [db.sequelize.fn("COUNT", db.sequelize.col("likes.id")), "like_count"],
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
      return res.status(404).json({ message: "작성된 게시글이 없습니다" });
    }

    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      return res
        .status(404)
        .json({ message: "사용자 정보를 찾을 수 없습니다." });
    }

    res.render("myPost", { user, posts });
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
  getMyPost,
};
