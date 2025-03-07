const db = require("../models");
const Like = db.Like;
const Post = db.Post;

// 좋아요 추가/취소
const toggleLike = async (req, res) => {
  try {
    const { user_id, post_id } = req.body;
    const existingLike = await Like.findOne({ user_id, post_id });

    if (existingLike) {
      await Like.destroy({ where: { user_id, post_id } });
      return res.status(200).json({ message: "좋아요 취소" });
    } else {
      await Like.create({ user_id, post_id });
      return res.status(201).json({ message: "좋아요 추가" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "좋아요 처리 실패", error: err.message });
  }
};

// 게시글의 좋아요 개수 조회
const getLikeCount = async (req, res) => {
  try {
    const { post_id } = req.params;
    const likeCount = await Like.count({ where: { post_id } });

    res.status(200).json({ post_id, like_count: likeCount });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "좋아요 개수 조회 실패", error: err.message });
  }
};

// 사용자가 좋아요한 게시글 목록 조회
const getUserLikePost = async (req, res) => {
  try {
    const { user_id } = req.params;
    const likePost = await Like.findAll({
      where: { user_id },
      include: [
        {
          model: Post,
          attributes: ["id", "title", "content", "image_url", "like"],
        },
      ],
    });
    res.status(200).json(likePost);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "좋아요 개수 조회 실패", error: err.message });
  }
};
