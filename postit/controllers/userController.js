const db = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const User = db.users;

// 아이디 중복 확인
const checkEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "이메일을 입력해 주세요." });
    }
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ message: "이미 사용 중인 이메일입니다." });
    }
    return res.status(200).json({ message: "사용 가능한 이메일입니다." });
  } catch (error) {
    console.error("이메일 중복 확인 오류:", error);
    return res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};

// 회원가입
const registerUser = async (req, res) => {
  try {
    const { email, username, password, address, gender, age, phone } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    // 중복
    // const existingUser = await User.findOne({ where: { email } });
    // if (existingUser) {
    //   return res.status(400).json({ message: "중복." });
    // }

    const user = await User.create({
      email,
      username,
      password: hashedPassword,
      address: address || null,
      gender,
      age,
      phone,
    });

    res.status(201).json({ message: "회원가입 성공", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "회원가입 실패", error: err.message });
  }
};

// 로그인
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 사용자 확인
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "사용자를 찾을 수 없음" });
    }

    // 비밀번호 검증
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "비밀번호가 일치하지 않음" });
    }

    // JWT 토큰 생성
    const token = jwt.sign(
      { id: user.id, email: user.email },
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

// 사용자 정보 업데이트
const updateUser = async (req, res) => {
  try {
    let id = req.params.id;
    let updateData = req.body;

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const [updated] = await User.update(updateData, { where: { id: id } });

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
};
