const express = require("express");
const router = express.Router();
const withAuth = require('../middleware/withAuth')

// Controllers
const UserController = require("../controller/UserController");

// Validations
const UserValidation = require("../validations/UserValidations");

router.post("/signup", UserValidation.signup, UserController.signup);
router.post("/login",UserValidation.login, UserController.login);

router.use(withAuth);

router.post("/updatePassword",UserValidation.updatePassword, UserController.updatePassword);
router.post("/resetPassword",UserValidation.resetPassword,UserController.resetPassword)
router.get("/email-verify/:hash", UserController.emailVerification);

module.exports = router;
