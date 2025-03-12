const modifyController = require("../controllers/modifyController");
const router = require("express").Router();

router.get("/:postId", modifyController.modifyInfo);

module.exports = router;
