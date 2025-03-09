const express = require("express");
const router = express.Router();
const mainController = require("../controllers/mainController");

router.get("/category", mainController.moveCategory);
router.get("/:url", mainController.moveUrl);

module.exports = router;
