"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("likes", {
      id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      post_id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        references: {
          model: "posts",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
    // 한 사용자의 좋아요 중복을 막음
    await queryInterface.addConstraint("likes", {
      fields: ["user_id", "post_id"],
      type: "unique",
      name: "unique_user_post_like",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("likes");
  },
};
