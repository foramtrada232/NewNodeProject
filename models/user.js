/** User Mongo DB model	*/

const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const SALT_WORK_FACTOR = 10;

const UserSchema = new mongoose.Schema({
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	userName: { type: String, required: true },
	password: { type: String, required: true },
	email: { type: String, required: true },
	emailHash: { type: String },
	emailConfirmation: { type: Boolean, default: false },
	resetPasswordHash: { type: String },
	images: String,
	createdAt: {
		type: Date,
		default: new Date(),
	},
	updatedAt: {
		type: Date,
		default: new Date(),
	},
});

// Boolean: --> hasMoney, canDance, isAvailable (has, can, is)


UserSchema.pre('save', function (next) {
	const user = this;
	bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
		if (err) return next(err);
		bcrypt.hash(user.password, salt, function (err, hash) {
			if (err) return next(err);
			user.password = hash;
			next();
		});
	});
 });


module.exports = mongoose.model("users", UserSchema);
