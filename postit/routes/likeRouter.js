const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/userMiddleware");
const likeController = require("../controllers/likeController");

router.post(
  "/:postId",
  authMiddleware.authenticateToken,
  likeController.toggleLike
);

router.get("/count/:postId", likeController.getLikeCount);

router.get(
  "/likedPosts",
  authMiddleware.authenticateToken,
  likeController.getUserLikedPosts
);

router.get(
  "/favoritePosts",
  authMiddleware.authenticateToken,
  likeController.userPosts
);

module.exports = router;
