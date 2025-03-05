const categoryController = require("../controllers/categoryController");
const router = require("express").Router();

router.get("/allCategories", categoryController.getAllCategories);

router.get("/:name", categoryController.getCategoryByName);

module.exports = router;
