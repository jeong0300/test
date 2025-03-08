const multer = require("multer");
const userController = require("../controllers/userController");
const router = require("express").Router();
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
  userController.authenticateToken,
  userController.getAllUsers
);

router.get(
  "/getUserId",
  userController.authenticateToken,
  userController.getUserByIdWrite
);

// 특정 유저 확인 (id)
router.get(
  "/getUser",
  userController.authenticateToken,
  userController.getUserByIdNav
);

router.get(
  "/profile",
  userController.authenticateToken,
  userController.getUserProfile
);

router.get("/naver", userController.naverLogin);

router.get("/callback", userController.callBack);

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
router.get(
  "/:id",
  userController.authenticateToken,
  userController.getUserById
);

router.put("/changePass", userController.changePass);

// 유저 정보 수정
router.put(
  "/info",
  upload.single("image"),
  userController.authenticateToken,
  userController.updateUser
);

// 유저 정보 삭제
router.delete(
  "/:id",
  userController.authenticateToken,
  userController.deleteUser
);

module.exports = router;
