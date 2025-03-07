const db = require("../models");
require("dotenv").config();

const Category = db.Category;

// 모든 카테고리
const getAllCategories = async (req, res) => {
  try {
    let categories = await Category.findAll({});
    res.status(200).json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "카테고리 조회 실패", error: err.message });
  }
};

// 카테고리 이름으로 조회
const getCategoryByName = async (req, res) => {
  try {
    let name = req.params.name;
    let category = await Category.findOne({ where: { name: name } });

    if (!category) {
      return res.status(404).json({ message: "카테고리를 찾을 수 없음" });
    }

    res.status(200).json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "카테고리 조회 실패", error: err.message });
  }
};

module.exports = {
  getAllCategories,
  getCategoryByName,
};
