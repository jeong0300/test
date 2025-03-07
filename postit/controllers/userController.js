const db = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
const multer = require("multer");
require("dotenv").config();

const User = db.User;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const upload = multer({ storage: storage });

// 아이디 중복 확인
const checkEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(200).json({ message: "이메일을 입력해 주세요." });
    }

    const existingUser = await User.findOne({ where: { email: email } });

    if (existingUser) {
      return res.status(200).json({ message: "이미 사용 중인 이메일입니다." });
    }
    return res.status(200).json({ message: "사용 가능한 이메일입니다." });
  } catch (error) {
    console.error("이메일 중복 확인 오류:", error);
    return res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};

// 전화번호 중복 확인
const checkPhone = async (req, res) => {
  try {
    const { phone } = req.body;

    const existingUser = await User.findOne({ where: { phone: phone } });

    if (existingUser) {
      return res.status(200).json({ message: "이미 가입된 전화번호입니다." });
    }
    return res.status(200).json({ message: "가입 가능한 전화번호입니다." });
  } catch (error) {
    console.error("이메일 중복 확인 오류:", error);
    return res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};

// 회원가입
const registerUser = async (req, res) => {
  try {
    const {
      email,
      username,
      password,
      address_main,
      address_detail,
      gender,
      birthDate,
      phone,
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const formatBirth = new Date(birthDate).toISOString().split("T")[0];

    const user = await User.create({
      email,
      username,
      password: hashedPassword,
      address_main,
      address_detail,
      gender,
      birthDate: formatBirth,
      formatBirth,
      phone,
    });

    res.status(200).json({ message: "회원가입 성공", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "회원가입 실패", error: err.message });
  }
};

// 로그인
const loginUser = async (req, res) => {
  try {
    const { email, pass } = req.body;

    // 사용자 확인
    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      return res.status(400).json({ message: "일치하는 계정이 없습니다." });
    }

    // 비밀번호 검증
    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });
    }

    // JWT 토큰 생성
    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "로그인 성공", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "로그인 실패", error: err.message });
  }
};

// JWT 인증 미들웨어
const authenticateToken = (req, res, next) => {
  const authHeader = req.header("Authorization");

  console.log(authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({ message: "유효한 토큰이 필요합니다" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    res
      .status(401)
      .json({ message: "토큰이 유효하지 않음", error: err.message });
  }
};

// 로그인 후
const getUserByIdNav = async (req, res) => {
  try {
    const username = req.user.username;
    const user = await User.findOne({ where: { username: username } });

    if (!user) {
      return res.status(404).json({ message: "사용자를 찾을 수 없음" });
    }

    res.status(200).json({
      username: user.username,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "사용자 조회 실패", error: err.message });
  }
};

// 아이디 찾기
const findId = async (req, res) => {
  try {
    const { username, phone } = req.body;

    if (!username || !phone) {
      return res.status(404).json({ message: "이름과 전화번호를 입력하세요" });
    }

    const user = await User.findOne({ where: { username, phone } });

    if (!user) {
      return res
        .status(404)
        .json({ message: "해당 정보를 가진 아이디가 없습니다" });
    }

    res.status(200).json({ email: user.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류 발생", error: err.message });
  }
};

// 새 비밀번호 저장
const findPw = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(404).json({ message: "이메일을 입력하세요" });
    }

    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      return res
        .status(200)
        .json({ message: "해당 정보를 가진 아이디가 없습니다" });
    }

    res.status(200).json({ email: user.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류 발생", error: err.message });
  }
};

// 비밀번호 변경
const changePass = async (req, res) => {
  try {
    const { email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    if (!email || !password) {
      return res.status(404).json({ message: "모든 필드를 입력하세요" });
    }

    const [updated] = await User.update(
      { password: hashedPassword },
      { where: { email } }
    );

    if (!updated) {
      return res
        .status(404)
        .json({ message: "해당 정보를 가진 아이디가 없습니다" });
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류 발생", error: err.message });
  }
};

const getUserByIdWrite = async (req, res) => {
  try {
    const id = req.user.id;
    const user = await User.findOne({ where: { id: id } });

    if (!user) {
      return res.status(404).json({ message: "사용자를 찾을 수 없음" });
    }

    res.status(200).json({
      id: user.id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "사용자 조회 실패", error: err.message });
  }
};

// 모든 사용자 조회
const getAllUsers = async (req, res) => {
  try {
    let users = await User.findAll({});
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "사용자 조회 실패", error: err.message });
  }
};

// ID로 사용자 조회
const getUserById = async (req, res) => {
  try {
    let id = req.params.id;
    let user = await User.findOne({ where: { id: id } });

    if (!user) {
      return res.status(404).json({ message: "사용자를 찾을 수 없음" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "사용자 조회 실패", error: err.message });
  }
};

// 사용자 정보 수정
const updateUser = async (req, res) => {
  try {
    let userId = req.user.id;
    let updateData = req.body;

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    if (req.file) {
      const imageUrl = `/uploads/${req.file.filename}`;
      updateData.image_url = imageUrl;
    }

    const [updated] = await User.update(updateData, {
      where: { id: userId },
    });

    if (!updated) {
      return res.status(404).json({ message: "업데이트할 사용자 없음" });
    }

    res.status(200).json({ message: "사용자 정보 업데이트 완료" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "사용자 업데이트 실패", error: err.message });
  }
};

// 사용자 삭제 > 탈퇴로 변경할 것 !!
const deleteUser = async (req, res) => {
  try {
    let id = req.params.id;
    const deleted = await User.destroy({ where: { id: id } });

    if (!deleted) {
      return res.status(404).json({ message: "삭제할 사용자 없음" });
    }

    res.status(200).json({ message: "사용자 삭제 완료" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "사용자 삭제 실패", error: err.message });
  }
};

// 이미지 업로드
const uploadImage = (req, res) => {
  if (!req.file) {
    console.log("이미지 파일이 없습니다.");
    return res.status(400).json({ message: "이미지 업로드 실패" });
  }
  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({ success: true, imageUrl });
};

// 프로필 사진, 주소 가져오기
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("id", userId);
    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ message: "사용자 정보를 찾을 수 없음" });
    }

    res.status(200).json({
      username: user.username,
      email: user.email,
      imageUrl: user.image_url || "/static/images/profile.png",
      address_main: user.address_main,
      address_detail: user.address_detail,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류", error: err.message });
  }
};

// 컨트롤러 내보내기
module.exports = {
  checkEmail,
  registerUser,
  loginUser,
  authenticateToken,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserByIdNav,
  checkPhone,
  uploadImage,
  findId,
  getUserByIdWrite,
  findPw,
  changePass,
  upload,
  getUserProfile,
};
