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
        // validate: {
        //   len: [8, 255],
        //   isStrongPassword(value) {
        //     const regex =
        //       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        //     if (!regex.test(value)) {
        //       throw new Error(
        //         "비밀번호는 최소 8자 이상, 대소문자, 숫자, 특수문자를 포함해야 합니다."
        //       );
        //     }
        //   },
        // },
      },
      username: {
        type: DataTypes.STRING(35),
        allowNull: false,
      },
      address_main: {
        // 도로명 주소
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      address_detail: {
        // 상세주소
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      gender: {
        type: DataTypes.ENUM("man", "woman"),
        allowNull: false,
      },
      birthDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING(13),
        allowNull: false,
        unique: true,
        validate: {
          is: /^01[0-9]-\d{3,4}-\d{4}$/,
        },
      },
      image_url: {
        type: DataTypes.STRING(255),
        allowNull: true,
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
