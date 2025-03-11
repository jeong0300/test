const postController = require("../controllers/postController");
const userController = require("../controllers/userController");

const router = require("express").Router();

// 게시글 작성
router.post("/create", postController.createPost);

// 특정 게시글 조회 (id)
router.get("/:postId", postController.getPostById);

// 내 글 조회
router.get("/myPost/:userId", postController.getMyPost);

// 게시글 수정
router.put("/edit/:id", postController.updatePost);

// 게시글 삭제
router.delete("/delete/:id", postController.deletePost);

module.exports = router;
