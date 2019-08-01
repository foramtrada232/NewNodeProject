const randomstring = require("randomstring");
const processMessage = require('../process-message');

// Service
const UserService = require('../services/UserService')

module.exports = {

	// user sign up
	signup(req, res) {
		// console.log("req:,",req)
		const userData = req.body;
		// const file = req.files;
		UserService.signup(userData).then((response) => {
			return res.status(200).json({ status: true, message: response.message, data: response.data, token: response.token });
		}).catch((error) => {
			console.log('error:', error);
			return res.status(error.status ? error.status : 500).json({ message: error.message ? error.message : 'Internal Server Error' });
		})
	},

	// user login
	login(req, res) {
		const userData = {
			userName: req.body.userName,
			password: req.body.password
		}
		UserService.login(userData).then((response) => {
			return res.status(200).json({ status: true, message: response.message,  token: response.token });
		}).catch((error) => {
			console.log('error:', error);
			return res.status(error.status ? error.status : 500).json({ message: error.message ? error.message : 'Internal Server Error' });
		})
	},

	// login user change password
	updatePassword(req, res) {
		const userData = {
			email: req.body.email,
			newPassword: req.body.newPassword,
			confirmPassword: req.body.confirmPassword
		};
		// console.log("headers==============>",req.headers)
		if (req.body.newPassword == req.body.confirmPassword){
			UserService.updatePassword(userData).then((response) => {
				return res.status(200).json({  message: response.message});
			}).catch((error) => {
				console.log('error:', error);
				return res.status(error.status ? error.status : 500).json({ message: error.message ? error.message : 'Internal Server Error' });
			})
		} else {
			res.status(400).json({message: "password dose not match"});
		}
	},

	// change password without login
	resetPassword(req, res) {
		const resetPasswordHash = randomstring.generate();
		const userData = {
			email: req.body.email,
			resetPasswordHash,
			link:'http://localhost:4200/forgot-password'
			// link: req.protocol + '://' + req.get('host')
		}
		UserService.resetPassword(userData).then((response) => {
			return res.status(200).json({ message: response.message });
		}).catch((error) => {
			console.log('error:', error);
			return res.status(error.status ? error.status : 500).json({ message: error.message ? error.message : 'Internal Server Error' });
		})
	},

	// email verification after reset password and change password
	emailVerification(req, res) {
		const userData = {
			emailHash: req.params.hash,
			password: req.body.password
		}
		UserService.emailVerification(userData).then((response) => {
			return res.status(200).json({ message: response.message});
		}).catch((error) => {
			console.log('error:', error);
			return res.status(error.status ? error.status : 500).json({ message: error.message ? error.message : 'Internal Server Error' });
		})
	},

	chatBot(req, res)  {
		const { message } = req.body;
		processMessage(message);
		return res.status(200).send(message);
	  },
  
};
