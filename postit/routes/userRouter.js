const userController = require("../controllers/userController");

const router = require("express").Router();

router.post("/check", userController.checkEmail);

router.post("/addUser", userController.registerUser);

router.post("/loginUser", userController.loginUser);

router.get(
  "/allUsers",
  userController.authenticateToken,
  userController.getAllUsers
);

router.get(
  "/:id",
  userController.authenticateToken,
  userController.getUserById
);

router.put("/:id", userController.authenticateToken, userController.updateUser);

router.delete(
  "/:id",
  userController.authenticateToken,
  userController.deleteUser
);

module.exports = router;
