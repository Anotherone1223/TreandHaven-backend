const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    //PORT
    secure: true,
    auth: {
        user: "",
        pass: "",
    },
});

// async..await is not allowed in global scope, must use a wrapper
async function sendMail() {
    // send mail with defined transport object
    const info = await transporter.sendMail({
        from: '', // sender address
        to: "bar@example.com, baz@example.com", // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Hello world?</b>", // html body
    });
}