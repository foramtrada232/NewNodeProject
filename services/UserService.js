// Database model
const UserModel = require("../models/user");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const CYPHERKEY = process.env.CYPHERKEY;
const clc = require("cli-color");
const clcError = clc.red.bold;
const multer = require('multer');
const _ = require('lodash');
// Service
const EmailService = require("./EmailService");


module.exports = {
    

    /** 
     * @param {object} userData user details 
     */
    signup: (userData,file) => {
        console.log("userdata==========>",userData);
        let images;
        return new Promise((resolve, reject) => {
            // userData.images = ;
            console.log("file in service:",file)
            UserModel.create(userData).then((user) => {
                console.log("user-=====>",user)
                // userData.images = file[0].filename;
                if (file.length > 0) {
					_.forEach(file, (gotFile) => {
                      user.images.push(gotFile.filename)
                    })
                    console.log("userimages============>",user.images);
                }
                userData.images = user.images;
                UserModel.findOneAndUpdate({ _id: user._id }, { $set: userData }, { upsert: true, new: true }).exec((error, users) => {
                    if (error) {
                        reject({ status: 500, message: 'Internal Serevr Error' });
                    } else {
                        console.log("user==============================>", users);
                        resolve({ status: 200, message: ' User Added Successfully', data: users });
                    }
                })
                resolve({ status: 200, message: "New user added successfully.", status: true, });
            }).catch((error) => {
                console.log(clcError("error: ", error));
                reject({ status: 500, status: false, message: 'User not added successfully. Please try again.' });
            })
        })
    },

    /**
     * @param {object} userData login details of user
     */
    login: (userData) => {
        return new Promise((resolve, reject) => {
            console.log("userData:", userData)
            UserModel.findOne({ userName: userData.userName }, function (err, user) {
                console.log("user:", user);
                if (err) {
                    reject({ status: 500, message: 'Internal Serevr Error' });
                } else if (!user) {
                    reject({ status: 404, message: 'No user found' });
                } else {
                    console.log('compare passowrd: ', userData.password, user.password);
                    const passwordIsValid = bcrypt.compare(userData.password, user.password);
                    console.log('valid password:', passwordIsValid);
                    if (!passwordIsValid) {
                        reject({ status: 401, message: "password is not valid", token: null });
                    }
                    const token = jwt.sign({ email: user.email }, CYPHERKEY, {
                        expiresIn: 86400
                    });
                    console.log('token=============>', token);
                    resolve({ status: 200, message: "login successfull", data: user, token: token });
                }
            });
        })
    },

    /**
     * @param {object} userData change password data
     */
    updatePassword: (userData) => {
        return new Promise((resolve, reject) => {
           const confirmPassword = bcrypt.hashSync(userData.confirmPassword);
            UserModel.findOneAndUpdate(
                { email: userData.email },
                { password: confirmPassword },
            ).then((data) => {
                if (data) {
                    resolve({ status: 200, message: "Password updated successfully" });
                } else {
                    reject({ status: 400, message: "Password does not updated." });
                }
            }).catch((err) => {
                reject({ status: 500, message: "Something went wrong. Please try again." });
            });
        })
    },

    /**
     * @param {object} userData forgot password details
     */
    resetPassword: (userData) => {
        return new Promise((resolve, reject) => {
            UserModel.findOneAndUpdate(
                { email: userData.email },
                { resetPasswordHash: userData.resetPasswordHash, emailHash: userData.resetPasswordHash },
            ).then((data) => {
                console.log("data", data);
                if (data) {
                    EmailService.resetPassword(
                        data.email,
                        data.firstName,
                        userData.link + '/' + userData.resetPasswordHash,
                    );
                    resolve({ status: 200, message: "Plase check your email.", });
                } else {
                    reject({ status: 400, message: "Email not found." });
                }
            }).catch((err) => {
                console.log(clcError("Err while find with email verification:-", err));
                resolve({ status: 500, message: "Something went wrong. Please try again." })
            });
        })
    },

    /**
     * @param {object} userData verification after reset password
     */
    emailVerification: (userData) => {
        return new Promise((resolve, reject) => {
            console.log("userData", userData)
            const Password = bcrypt.hashSync(userData.password);
            UserModel.findOneAndUpdate(
                { emailHash: userData.emailHash, emailConfirmation: false },
                { emailHash: "", emailConfirmation: true, password: Password },
            ).then((data) => {
                console.log("data:", data)
                if (data) {
                    console.log("data==========>", data)
                    resolve({ status: 200, message: "Email verified." });
                } else {
                    reject({ status: 400, message: "Invalid email verification link." });
                }
            }).catch((err) => {
                console.log(clcError("Error while find with email verification:-", err));
                reject({ status: 500, message: "Something went wrong. Please try again." });
            });
        })
    }
}

