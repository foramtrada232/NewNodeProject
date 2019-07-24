const express = require("express");
const router = express.Router();
const withAuth = require('../middleware/withAuth')

// Controllers
const UserController = require("../controller/UserController");

// Validations
const UserValidation = require("../validations/UserValidations");

router.post("/signup", UserValidation.signup, UserController.signup);
router.post("/login",UserValidation.login, UserController.login);

router.post(withAuth);
router.post("/updatePassword",UserValidation.updatePassword, UserController.updatePassword);
router.post("/forgotPassword", UserController.forgotPassword);

module.exports = router;
