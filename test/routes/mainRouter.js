const express = require("express");
const router = express.Router();
const mainController = require("../controllers/mainController");

router.get("/login", mainController.moveLogin);
router.get("/join", mainController.moveJoin);
router.get("/:url", mainController.move);

module.exports = router;
