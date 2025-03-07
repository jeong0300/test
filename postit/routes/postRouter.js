const postController = require("../controllers/postController");

const router = require("express").Router();

// 게시글 작성
router.post("/create", postController.createPost);

// 모든 게시글 조회
router.get("/allPosts", postController.getAllPosts);

// 특정 게시글 조회 (id)
router.get("/:id", postController.getPostById);

// 게시글 수정
router.put("/:id", postController.updatePost);

// 게시글 삭제
router.delete("/:id", postController.deletePost);

module.exports = router;
