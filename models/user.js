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
	resetPasswordHash: { type: String },
	createdAt: {
		type: Date,
		default: new Date(),
	},
	updatedAt: {
		type: Date,
		default: new Date(),
	},
});


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

 UserSchema.methods.comparePassword = function(userPassword, password, cb) {
    bcrypt.compare(userPassword, password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};



module.exports = mongoose.model("users", UserSchema);
