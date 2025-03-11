module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define(
    "Like",
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
        references: {
          model: "User",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      post_id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        references: {
          model: "Post",
          key: "id",
        },
        onDelete: "CASCADE",
      },
    },
    {
      timestamps: true,
      indexes: [
        {
          unique: true,
          // 중복 좋아요 방지
          fields: ["user_id", "post_id"],
        },
      ],
    }
  );

  Like.associate = (models) => {
    Like.belongsTo(models.User, { foreignKey: "user_id", onDelete: "CASCADE" });
    Like.belongsTo(models.Post, { foreignKey: "post_id", onDelete: "CASCADE" });
  };

  return Like;
};
