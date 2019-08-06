const jwt = require("jsonwebtoken");

module.exports = {


	signIn: async userData => jwt.sign(
		userData,
		process.env.CYPHERKEY,
		{
			expiresIn: process.env.TOKENEXPIRETIME,
		},
	),

	validateToken: async (req, res, next) => {
		const { authorization } = req.headers;
		new Promise(async (resolve, reject) => {
			if (authorization && authorization !== "") {
				jwt.verify(authorization, process.env.cypherKey, (err, decoded) => {
					if (err) {
						reject({status: 500,message: "Failed to authenticate token."});
					} else {
						resolve({status: 200,user: decoded});
					}
				});
			} else {
				resolve({status: 500,message: "Authorization token must be required!"});
			}
		}).then(({ status, message, user }) => {
			req.user = (status) ? user : null;
			// no-unused-expressions
			(status) ? next() : res.json({ status, message });
		});
	},
}