const multer = require("multer");
const userController = require("../controllers/userController");
const router = require("express").Router();
const cookieParser = require("cookie-parser");
const authMiddleware = require("../middleware/userMiddleware");
const path = require("path");

// Multer 설정 (파일 업로드)
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const upload = multer({ storage });

router.get(
  "/allUsers",
  authMiddleware.authenticateToken,
  userController.getAllUsers
);

router.get(
  "/getUserId",
  authMiddleware.authenticateToken,
  userController.getUserByIdWrite
);

// 특정 유저 확인 (id)
router.get(
  "/getUser",
  authMiddleware.authenticateToken,
  userController.getUserByIdNav
);

router.get(
  "/profile",
  authMiddleware.authenticateToken,
  userController.getUserProfile
);

// 네이버 로그인
router.get("/naver", userController.naverLogin);

router.get("/callback", userController.callBack);

// 카카오톡 로그인
router.get("/kakao-key", userController.kakaoKey);

router.get("/kakao", userController.kakaoRedirect);

router.get("/kakao/callback", userController.kakaoCallback);

router.get("/login", (req, res) => {
  res.render("login");
});

// 아이디 중복 확인
router.post(
  "/check",
  authMiddleware.authenticateToken,
  userController.checkEmail
);

// 전화번호 중복 확인
router.post(
  "/phoneCheck",
  authMiddleware.authenticateToken,
  userController.checkPhone
);

// 유저 추가
router.post(
  "/addUser",
  authMiddleware.authenticateToken,
  userController.registerUser
);

router.post(
  "/loginUser",
  authMiddleware.authenticateToken,
  userController.loginUser
);

router.post("/findId", authMiddleware.authenticateToken, userController.findId);

router.post("/findPw", authMiddleware.authenticateToken, userController.findPw);

router.post(
  "/uploadImage",
  userController.upload.single("image"),
  userController.uploadImage
);

// 특정 유저 확인 (id)
router.get(
  "/:id",
  authMiddleware.authenticateToken,
  userController.getUserById
);

router.put(
  "/changePass",
  authMiddleware.authenticateToken,
  userController.changePass
);

// 유저 정보 수정
router.put(
  "/info",
  upload.single("image"),
  authMiddleware.authenticateToken,
  userController.updateUser
);

// 유저 정보 삭제
router.delete(
  "/deleteUser",
  authMiddleware.authenticateToken,
  userController.deleteUser
);

module.exports = router;
