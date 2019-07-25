const nodemailer = require("nodemailer");
const mailerhbs = require("nodemailer-express-handlebars");

const transporter = nodemailer.createTransport({
    host: process.env.HOST,
    port: process.env.SMTPPORT,
    secure: process.env.SECURE,
    auth: {
        user: process.env.SMTPUSERNAME,
        pass: process.env.PASSWORD,
    },
});

transporter.use("compile", mailerhbs({
    viewPath: "emailTemplate",
    extName: ".hbs", 
}));

const createParams = (from, to, subject, template, name, link) => ({
    from,
    to,
    subject,
    template, 
    context: { 
        name,
        email: to,
        link
    },
});
module.exports = {
    resetPassword: (to, name, link) => {
        return new Promise((resolve, reject) => {
            const params = createParams(
                process.env.WELCOMEEMAIL,
                to,
                `Welcome to ${process.env.SITENAME} Confirm your email`,
                "resetPassword",
                name,
                link
            );
            transporter.sendMail(params, function (error, info) {
                if (error) {
                    console.log("Error", error);
                    reject({ status: 500, message: 'Internal Serevr Error' });
                } else {
                    console.log("link:",link)
                    console.log('Email sent: ' + info.response);
                    resolve({ status: 200, message: 'Email sent:' + info.response });
                }
            });
        })
    }

};
