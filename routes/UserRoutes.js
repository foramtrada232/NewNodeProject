const express = require("express");
const router = express.Router();
const withAuth = require('../middleware/withAuth');
const fileUpload = require('../middleware/fileUpload');
// Controllers
const UserController = require("../controller/UserController");

// Validations
const UserValidation = require("../validations/UserValidations");

router.post("/signup",fileUpload.upload('images'), UserValidation.signup, UserController.signup);
router.post("/login", UserValidation.login, UserController.login);
router.post("/resetPassword", UserValidation.resetPassword, UserController.resetPassword)
router.post('/chat', UserController.chatBot);
router.post("/email-verify/:hash", UserController.emailVerification);

router.use(withAuth);

router.post("/updatePassword", UserController.updatePassword);

module.exports = router;
