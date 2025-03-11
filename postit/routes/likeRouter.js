const express = require("express");
const router = express.Router();
const likeController = require("../controllers/likeController");

router.post(
  "/:postId/like",
  likeController.authenticateToken,
  likeController.toggleLike
);

router.get("/:postId/likes", likeController.getLikeCount);

router.get(
  "/:postId/liked",
  likeController.authenticateToken,
  likeController.checkIfLiked
);

module.exports = router;
