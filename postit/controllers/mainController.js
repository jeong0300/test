// const products = require("../models/mainModel");

const moveUrl = (req, res) => {
  const url = req.params.url;
  res.render(url);
};

const moveCategory = async (req, res) => {
  const id = req.params.categoryId;
  // 카테고리 별 페이지 이동
  // const product = await products.move(url);
  // res.render(url, { product });
};

module.exports = { moveUrl, moveCategory };
