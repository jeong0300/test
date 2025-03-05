const { Sequelize, DataTypes } = require("sequelize");
const env = process.env.NODE_ENV || "development";

const config = require("../config/config.json")[env];

const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

db.users = require("./userModel.js")(sequelize, DataTypes);
db.categories = require("./categoryModel.js")(sequelize, DataTypes);
db.likes = require("./likeModel.js")(sequelize, DataTypes);
db.posts = require("./postModel.js")(sequelize, DataTypes);

db.Sequelize = Sequelize;
db.sequelize = sequelize;

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("데이터베이스 연결됨.");
  })
  .catch((err) => {
    console.error(err);
  });

module.exports = db;
