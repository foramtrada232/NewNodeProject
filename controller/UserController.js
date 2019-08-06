const randomstring = require("randomstring");
const processMessage = require('../process-message');

// Service
const UserService = require('../services/UserService')

module.exports = {

	/** 
	 * user sign up 
	 */
	signup(req, res) {
		console.log("req:,", req.body)
		const userData = req.body;
		// const file = req.files;
		UserService.signup(userData).then((response) => {
			return res.status(200).json({ message: response.message, data: response.data, token: response.token });
		}).catch((error) => {
			console.log('error:', error);
			return res.status({ status: 500 }).json({ message: error.message ? error.message : 'internal server error' });
		})
	},

	/**
	 * user login 
	 */ 
	login(req, res) {
		const userData = {
			userName: req.body.userName,
			password: req.body.password
		}
		UserService.login(userData).then((response) => {
			return res.status(200).json({ message: response.message, token: response.token });
		}).catch((error) => {
			console.log('error:', error);
			return res.status(error.status ? error.status : 500).json({ message: error.message ? error.message : 'internal server error' });
		})
	},

	/** 
	 * login user change password 
	 */
	updatePassword(req, res) {
		console.log("userData:",req.body)
		const userData = {
			email: req.body.email,
			oldPassword: req.body.oldPassword,
			newPassword: req.body.newPassword,
			confirmPassword: req.body.confirmPassword
		};
		if (req.body.newPassword == req.body.confirmPassword) {
			UserService.updatePassword(userData).then((response) => {
				return res.status(200).json({ message: response.message });
			}).catch((error) => {
				console.log('error:', error);
				return res.status(error.status ? error.status : 500).json({ message: error.message ? error.message : 'internal server error' });
			})
		} else {
			res.status(400).json({ message: "password dose not match" });
		}
	},

	/** 
	 * change password without login 
	 */
	resetPassword(req, res) {
		const resetPasswordHash = randomstring.generate();
		const userData = {
			email: req.body.email,
			resetPasswordHash,
			// link: 'http://localhost:4200/forgot-password'
			link: 'http://localhost:3000/resetpassword'
			// link: req.protocol + '://' + req.get('host')
		}
		UserService.resetPassword(userData).then((response) => {
			return res.status(200).json({ message: response.message });
		}).catch((error) => {
			console.log('error:', error);
			return res.status(error.status ? error.status : 500).json({ message: error.message ? error.message : 'internal server error' });
		})
	},

	/**
	 * email verification after reset password and change password 
	 */
	emailVerification(req, res) {
		const userData = {
			emailHash: req.params.hash,
			password: req.body.password
		}
		UserService.emailVerification(userData).then((response) => {
			return res.status(200).json({ message: response.message });
		}).catch((error) => {
			console.log('error:', error);
			return res.status(error.status ? error.status : 500).json({ message: error.message ? error.message : 'internal server error' });
		})
	},

	/**
	 * chatbot 
	 */
	chatBot(req, res) {
		const { message } = req.body;
		processMessage(message);
		return res.status(200).send(message);
	},
};
