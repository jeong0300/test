"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("categories", [
      { name: "여행 후기 및 정보" },
      { name: "숙박" },
      { name: "맛집 & 카페" },
      { name: "자유 게시판" },
      { name: "사진 갤러리" },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("categories", null, {});
  },
};
