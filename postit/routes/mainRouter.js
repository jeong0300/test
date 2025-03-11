const express = require("express");
const router = express.Router();
const mainController = require("../controllers/mainController");

router.get("/:url", mainController.moveUrl);
router.get("/:url", mainController.moveCategory);

module.exports = router;
