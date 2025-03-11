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
router.post("/check", userController.checkEmail);

// 전화번호 중복 확인
router.post("/phoneCheck", userController.checkPhone);

// 유저 추가
router.post("/addUser", userController.registerUser);

router.post("/loginUser", userController.loginUser);

router.post("/findId", userController.findId);

router.post("/findPw", userController.findPw);

router.post(
  "/uploadImage",
  userController.upload.single("image"),
  userController.uploadImage
);

// 특정 유저 확인 (id)
router.get("/:id", userController.getUserById);

router.put("/changePass", userController.changePass);

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
