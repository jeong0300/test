const db = require("../models");
const Like = db.Like;
const Post = db.Post;

// 좋아요 추가/취소 및 좋아요 개수 저장
const toggleLike = async (req, res) => {
  try {
    const { postId } = req.params;
    const user_id = req.user.userId;
    const existingLike = await Like.findOne({
      where: { user_id: user_id, post_id: postId },
    });
    if (existingLike) {
      await existingLike.destroy();
    } else {
      await Like.create({ user_id: user_id, post_id: postId });
    }
    const likeCount = await Like.count({ where: { post_id: postId } });
    await Post.update({ like_count: likeCount }, { where: { id: postId } });
    return res.status(200).json({
      message: existingLike ? "좋아요 취소" : "좋아요 추가",
      liked: !existingLike,
      post_id: postId,
      like_count: likeCount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "좋아요 처리 실패", error: err.message });
  }
};

// 게시글의 좋아요 개수 조회
const getLikeCount = async (req, res) => {
  try {
    const { post_id } = req.params;
    // 개수
    const likeCount = await Like.count({ where: { post_id } });
    res.status(200).json({ post_id, like_count: likeCount });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "좋아요 개수 조회 실패", error: err.message });
  }
};
// 사용자가 좋아요한 게시글
const getUserLikedPosts = async (req, res) => {
  try {
    const user_Id = req.user.userId;
    const likePosts = await Like.findAll({
      where: { user_Id },
      attributes: ["post_id"],
    });
    const likedPostIds = likePosts.map((like) => like.post_id);

    res.status(200).json({
      likePosts,
      likedPostIds,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "좋아요 개수 조회 실패", error: err.message });
  }
};

const userPosts = async (req, res) => {
  try {
    const user_Id = req.user.userId;
    const likePosts = await Like.findAll({
      where: { user_Id },
      attributes: ["post_id"],
    });
    const likedPostIds = likePosts.map((like) => like.post_id);

    const posts = await Post.findAll({
      where: {
        id: likedPostIds,
      },
    });

    const modifiedPosts = posts.map((post) => ({
      ...post.toJSON(),
      content: post.content.replace(/<[^>]*>/g, ""),
    }));

    res.render("favorite", {
      modifiedPosts,
      likePosts,
      likedPostIds,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "좋아요 개수 조회 실패", error: err.message });
  }
};

module.exports = {
  toggleLike,
  getLikeCount,
  getUserLikedPosts,
  userPosts,
};
