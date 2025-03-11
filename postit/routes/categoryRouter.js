const categoryController = require("../controllers/categoryController");
const router = require("express").Router();

router.get("/allCategories", categoryController.getAllCategories);

router.get("/:categoryId", categoryController.getPostByCategoryId);

module.exports = router;
