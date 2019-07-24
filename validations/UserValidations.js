module.exports = {
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
			.catch(errors => res.json({
				success: false,
				errors: errors[0].msg,
			}));
	},
	login(req, res, next) {
		req.checkBody("userName", "Username is required").trim().notEmpty();
		req.checkBody("password", "Password is required").trim().notEmpty();

		req.asyncValidationErrors()
			.then(() => {
				next();
			})
			.catch(errors => res.json({
				success: false,
				errors: errors[0].msg,
			}));
	},
	updatePassword(req, res, next) {
		// req.checkBody("hash", "Reset password hash is required").trim().notEmpty();
		req.checkBody("password", "Password is required").trim().notEmpty();
		req.checkBody("currentPassword", "currentPassword is required").trim().notEmpty();
		req.checkBody("newPassword", "newPassword password is required").trim().notEmpty();
		req.checkBody("newPassword", "newPassword password is not match with password").equals(req.body.password);
		req.checkBody("password", "Password must be 8 to 20 length").trim().len(8, 20);

		req.asyncValidationErrors()
			.then(() => {
				next();
			})
			.catch(errors => res.json({
				success: false,
				errors: errors[0].msg,
			}));
	},
};
