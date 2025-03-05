module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    "Post",
    {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
      },
      category_id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      image_url: {
        type: DataTypes.STRING(255), // 대표 사진 저장
        allowNull: true,
      },
      like_count: {
        type: DataTypes.INTEGER(1000),
      },
    },
    {
      timestamps: true,
    }
  );

  Post.associate = (models) => {
    Post.belongsTo(models.User, { foreignKey: "user_id", onDelete: "CASCADE" });
    Post.belongsTo(models.Category, {
      foreignKey: "category_id",
      onDelete: "SET NULL",
    });
    Post.hasMany(models.Like, { foreignKey: "post_id", onDelete: "CASCADE" });
  };

  return Post;
};
