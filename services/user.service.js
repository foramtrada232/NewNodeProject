// Database model
const UserModel = require("../models/user");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const CYPHERKEY = process.env.CYPHERKEY;
const clc = require("cli-color");
const clcError = clc.red.bold;
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    service: 'gmail',
    auth: {
        user: 'raoinfotechp@gmail.com',
        pass: 'raoinfotech@123'
    }
});

const createParams = (from, to, subject, html, text) => ({
    from: 'raoinfotechp@gmail.com',
    to,
    subject,
    html,
    text: 'Hi, this is a testing email from node server',
});


module.exports = {

    signup: (userData) => {
        return new Promise((resolve, reject) => {
            UserModel.create(userData).then(() => {
                resolve({ status: 200, message: "New user added successfully.", status: true, });
            }).catch((error) => {
                console.log(clcError("error: ", error));
                reject({ status: 500, status: false, message: 'User not added successfully. Please try again.' });
            })
        })
    },

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

    updatePassword: (userData) => {
        return new Promise((resolve, reject) => {
            UserModel.findOne({ email: userData.email }).exec((err, user) => {
                if (err) {
                    reject({ status: 400, message: 'Internal Server Error.' });
                } else if (user) {
                    user.comparePassword(userData.newPassword, bcrypt.hashSync(userData.password), (error, isMatch) => {
                        if (error) {
                            reject({ status: 400, message: 'Internal Server Error.' });
                        } else if (isMatch) {
                            user.password = userData.currentPassword;
                            user.save();
                            console.log(user);
                            resolve({ status: 200, message: "Password updated successfully." });
                        }
                        else {
                            resolve({ status: 412, message: "password does not match." });
                        }
                    });
                } else {
                    reject({ status: 400, message: 'Internal Server Error.' });

                }
            })
        })
    },
    forgotPassword: (forgotPasswordData) => {
        return new Promise((resolve, reject) => {
            let params = '';
            let template = `<!DOCTYPE html>
                <html>
                <head>
                <title>Mail Template</title>
                <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.1/css/all.css">
                </head>
                <body style="background-color: #F9F9F9;  font-family: sans-serif;">
                <center><img src="https://raoinformationtechnology.com/theme/images/raoinfotech-logo.png" height="40px" width="90px" style="position: fixed;left: 0px;right: 0px; margin: auto;top: 35px;"></center>
                <div style="width: 500px; margin: auto; background-color: white; top: 100px; position: fixed;left: 0;
                right: 0;box-shadow: 0px 0px 20px lightgray">
            
                <div style="background-image: url(https://1f58eb32.ngrok.io/bg-img.png); background-repeat: no-repeat;background-size: cover;background-color: #3998c51c; padding: 15px 0px">
                <h6 style="margin: 0px;color: #181123;font-size: 20px;text-align: center"><b>Hello `+ forgotPasswordData.name + `</b></h6>
            
                <div style="margin-left:30px;padding:0;">
                <p style="font-size:15px;">You, or someone else, requested an new password for this account on Project Management Tool</p>
                <p style="font-size:15px;">You can reset your password using given link below. When you do nothing, your password or account will not change.</p>
                <p style="font-size:15px;"><a href="http://localhost:4200/#/forgotpwd/` + forgotPasswordData.token + `">http://localhost:4200/#/forgotpwd</a></p>
                <p style="font-size:15px;">This link will expires in 10 minutes.</p>
                </div>
                </div>
                </div>
                </body>
                </html>
                `;

                params = createParams(
                    'raoinfotechp@gmail.com',
                    forgotPasswordData.email,
                    'Localhost Forgot Password Request',
                    template,
                );

            transporter.sendMail(params, function (error, info) {
                if (error) {
                    console.log("Error", error);
                    reject({ status: 500, message: 'Internal Serevr Error' });
                } else {
                    console.log('Email sent: ' + info.response);
                    resolve({ status: 200, message: 'Email sent:' + info.response });
                }
            });
        })
    }
}

