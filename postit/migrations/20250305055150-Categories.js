"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Categories", {
      id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
    });

    // 카테고리 초기 데이터 삽입
    await queryInterface.bulkInsert("Categories", [
      { name: "여행 후기 및 정보" },
      { name: "숙박" },
      { name: "맛집 & 카페" },
      { name: "자유 게시판" },
      { name: "사진 갤러리" },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Categories");
  },
};
