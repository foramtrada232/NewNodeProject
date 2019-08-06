module.exports = {
	/** validation for user signup */
	signup(req, res, next) {
		req.checkBody("firstName", "Firstname is required").trim().notEmpty();
		req.checkBody("lastName", "Lastname is required").trim().notEmpty();
		req.checkBody("email", "Email is required").trim().notEmpty();
		req.checkBody("email", "Email is not valid").trim().isEmail();
		req.checkBody("userName", "Username is required").trim().notEmpty();
		req.checkBody("userName", "Username must be 6 to 15 length").trim().len(6, 15);
		req.checkBody("password", "Password is required").trim().notEmpty();
		req.checkBody("password", "Password must be 8 to 20 length").trim().len(8, 20);

		req.asyncValidationErrors()
			.then(() => {
				next();
			})
			.catch(errors => res.status(500).json({
				success: false,
				errors: errors[0].msg,
			}));
	},

	/** login validation */
	login(req, res, next) {
		req.checkBody("userName", "Username is required").trim().notEmpty();
		req.checkBody("password", "Password is required").trim().notEmpty();

		req.asyncValidationErrors()
			.then(() => {
				next();
			})
			.catch(errors => res.status(500).json({
				success: false,
				errors: errors[0].msg,
			}));
	},

	/** change password validation */
	updatePassword(req, res, next) {
		req.checkBody("email", "Email is required").trim().notEmpty();
		req.checkBody("oldPassword", "Old paasword is required").trim().notEmpty();
		req.checkBody("newPassword", "New password is required").trim().notEmpty();
		req.checkBody("confirmPassword", "ConfirmPassword is not match with password").equals(req.body.newPassword);

		req.asyncValidationErrors()
			.then(() => {
				next();
			})
			.catch(errors => res.status(500).json({
				success: false,
				errors: errors[0].msg,
			}));
	},

	/** forgot password validation */
	resetPassword(req, res, next) {
		req.checkBody("email", "Email is required").trim().notEmpty();
		req.checkBody("email", "Email is not valid").trim().isEmail();

		req.asyncValidationErrors()
			.then(() => {
				next();
			})
			.catch(errors => res.status(500).json({
				success: false,
				errors: errors[0].msg,
			}));
	},
};
