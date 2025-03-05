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
      },
      post_id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
      },
    },
    {
      timestamps: true,
    }
  );

  Like.associate = (models) => {
    Like.belongsTo(models.User, { foreignKey: "user_id", onDelete: "CASCADE" });
    Like.belongsTo(models.Post, { foreignKey: "post_id", onDelete: "CASCADE" });
  };

  return Like;
};
