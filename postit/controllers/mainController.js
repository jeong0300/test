// const products = require("../models/mainModel");

const moveLogin = (req, res) => {
  console.log("login");
  res.render("login");
};

const moveJoin = (req, res) => {
  console.log("join");
  res.render("join");
};

const move = async (req, res) => {
  const url = req.params.url;
  // 카테고리 별 페이지 이동
  // const product = await products.move(url);
  // res.render(url, { product });
};

module.exports = { moveLogin, moveJoin, move };
