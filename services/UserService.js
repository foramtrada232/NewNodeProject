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
    signup: (userData) => {
        return new Promise((resolve, reject) => {
            UserModel.create(userData).then((user) => {
                // if (file.length > 0) {
                //     _.forEach(file, (gotFile) => {
                //         user.images.push(gotFile.filename)
                //     })
                // }
                // userData.images = user.images;
                // UserModel.findOneAndUpdate({ _id: user._id }, { $set: userData }, { upsert: true, new: true }).exec((error, users) => {
                //     if (error) {
                //         reject({ status: 500, message: 'Internal Serevr Error' });
                //     } else {
                //         console.log("user==============================>", users);
                //         resolve({ status: 200, message: ' User Added Successfully', data: users });
                //     }
                // })
                resolve({ status: 500, message: "Register successfully." });
            }).catch((error) => {
                console.log(clcError("error: ", error));
                reject({ status: 200, message: 'Not registerd. Please try again.' });
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
                } else if (user) {
                    const passwordIsValid = bcrypt.compareSync(userData.password, user.password);
                    console.log('valid password:', passwordIsValid);
                    if (!passwordIsValid) {
                        reject({ status: 401, message: "password is not valid", token: null });
                    }
                    const token = jwt.sign({ email: user.email }, CYPHERKEY, {
                        expiresIn: 86400
                    });
                    console.log('token=============>', token);
                    resolve({ status: 200, message: "login successfull", data: user, token: token });
                } else {
                    reject({ status: 404, message: 'Internal Server Error' });
                }
            });
        })
    },

    /**
     * @param {object} userData change password data
     */
    updatePassword: (userData) => {
        return new Promise((resolve, reject) => {
            console.log("userData:",userData)
            const confirmPassword = bcrypt.hashSync(userData.confirmPassword, 10);
            UserModel.findOne({email: userData.email}).exec((err,user)=>{
                if (err) {
                    reject({ status: 400, message: "User not found." });
                } else if(user){
                    console.log("user:",user);
                    const passwordIsValid = bcrypt.compareSync(userData.oldPassword, user.password);
                    console.log('valid password:', passwordIsValid);
                    if (!passwordIsValid) {
                        reject({ status: 401, message: "Old password is not valid", token: null });
                    } else {
                        UserModel.findOneAndUpdate(
                            {email:userData.email},
                            {password: confirmPassword}
                        ).exec((err,updatedUser) => {
                            if (err) {
                                reject({ status: 400, message: "Password does not updated." });
                            } else if (updatedUser) {
                                resolve({ status: 200, message: "Password sucessfully updated." });
                            } else {
                                reject({ status: 400, message: "Internal Server Error." });
                            }
                        })
                    }
                } 
            // const passwordIsValid = bcrypt.compare(UserModel.password,userData.oldPassword);
            // console.log("passwordIsValid:",passwordIsValid)
            // const oldPassword = bcrypt.hashSync(userData.oldPassword)
            // console.log("================",confirmPassword)
            // UserModel.findOneAndUpdate(
            //     { email: userData.email,password:userData.oldPassword},
            //     { password: confirmPassword }
            //     ).then((data) => {
            //         console.log("data:",data)
            //         if (data) {
                    //     const passwordIsValid = bcrypt.compareSync(oldPassword, data.password);
                    //     if (!passwordIsValid) {
                    //     reject({ status: 400, message: "Old paasword is wrong." });  
                    //   } else {
                        //   resolve({ status: 200, message: "Password sucessfully updated." });
                    //   }         
                // } else {
                    // reject({ status: 400, message: "Password does not updated." });
                // }
        //     }).catch((err) => {
        //         reject({ status: 500, message: "Something went wrong. Please try again." });
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
                { resetPasswordHash: userData.resetPasswordHash, emailHash: userData.resetPasswordHash, emailConfirmation: false },
            ).then((data) => {
                console.log("data", data);
                if (data) {
                    EmailService.resetPassword(
                        data.email,
                        data.firstName,
                        userData.link + '/' + userData.resetPasswordHash,
                    );
                    resolve({ status: 200, message: "Plase check your mail.", });
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
                    resolve({ status: 200, message: "Password sucessfully updated." });
                } else {
                    reject({ status: 400, message: "Invalid email verification link." });
                }
            }).catch((err) => {
                console.log(clcError("Error while find with email verification:-", err));
                reject({ status: 500, message: "Something went wrong. Please try again." });
            });
        })
    },
}

