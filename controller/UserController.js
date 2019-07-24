const clc = require("cli-color");
const clcError = clc.red.bold;
const jwt = require("jsonwebtoken");
const CYPHERKEY = process.env.CYPHERKEY;

// Database model
const UserModel = require("../models/user");
// Service
const UserService = require('../services/user.service')

module.exports = {
	signup(req, res) {
		const userData = {
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			email: req.body.email,
			userName: req.body.userName,
			password: req.body.password,
		};
		UserService.signup(userData).then((response) => {
			return res.status(200).json({ status: 1, message: response.message, data: response.data, token: response.token });
		}).catch((error) => {
			console.log('error:', error);
			return res.status(error.status ? error.status : 500).json({ message: error.message ? error.message : 'internal server error' });
		})
	},
	login(req, res) {
		const userData = {
			userName: req.body.userName,
			password: req.body.password
		}
		UserService.login(userData).then((response) => {
			return res.status(200).json({ status: 1, message: response.message, data: response.data, token: response.token });
		}).catch((error) => {
			console.log('error:', error);
			return res.status(error.status ? error.status : 500).json({ message: error.message ? error.message : 'internal server error' });
		})
	},
	updatePassword(req, res){
		const userData = {
			email: req.body.email,
			currentPassword: req.body.currentPassword,
			password: req.body.password,
			newPassword: req.body.newPassword
		}
		UserService.updatePassword(userData).then((response) => {
			console.log("response:",response)
			return res.status(200).json({ status: true, message: response.message, data: response.data, token: response.token });
		}).catch((error) => {
			console.log('error:', error);
			return res.status(error.status ? error.status : 500).json({ message: error.message ? error.message : 'internal server error' });
		})
	},
	forgotPassword: (req, res) => {
		console.log("forgot password");
		console.log(req.headers.referer);
		UserModel.findOne({ email: req.body.email })
			.exec((err, user) => {
				if (err) {
					return res.status(500).send({ errMsg: err });
				} else if (user) {
					console.log("user:::",user)
					user.temporarytoken = jwt.sign({ userName: user.userName, email: user.email }, CYPHERKEY, { expiresIn: '10min' }); // Create a token for activating account through e-mail
					console.log("token:",user.temporarytoken)
					const forgotPasswordData = {
						userName: user.name,
						token: user.temporarytoken,
						email: req.body.email,
						url: req.headers.referer
					}
					UserService.forgotPassword(forgotPasswordData)
					res.status(200).send(user);
				} else {
					return res.status(404).send({ errMsg: 'Could not find your username' });
				}
			});
	},
};
