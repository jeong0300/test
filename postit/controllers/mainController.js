// const products = require("../models/mainModel");

const moveUrl = (req, res) => {
  const url = req.params.url;
  res.render(url);
};

const move = async (req, res) => {
  const url = req.params.url;
  // 카테고리 별 페이지 이동
  // const product = await products.move(url);
  // res.render(url, { product });
};

module.exports = { moveUrl, move };
