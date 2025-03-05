module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          len: [8, 255],
          isStrongPassword(value) {
            const regex =
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            if (!regex.test(value)) {
              throw new Error(
                "비밀번호는 최소 8자 이상, 대소문자, 숫자, 특수문자를 포함해야 합니다."
              );
            }
          },
        },
      },
      username: {
        type: DataTypes.STRING(35),
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      gender: {
        type: DataTypes.ENUM("남", "여"),
        allowNull: false,
      },
      birthdate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING(15),
        allowNull: false,
        unique: true,
        validate: {
          is: /^[0-9]{10,11}$/,
        },
      },
    },
    {
      timestamps: true,
    }
  );

  User.associate = (models) => {
    User.hasMany(models.Post, { foreignKey: "user_id", onDelete: "CASCADE" });
    User.hasMany(models.Like, { foreignKey: "user_id", onDelete: "CASCADE" });
  };

  return User;
};
