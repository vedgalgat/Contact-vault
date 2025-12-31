const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendMail(email, name) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER, 
      to: email,
      subject: "Welcome to Our App ❤🎁",
      text: `Hello ${name}, Welcome to our Authentication App. this is My first production like application.`
    };

    await transporter.sendMail(mailOptions);
    console.log("Mail sent successfully ✔");
  } catch (err) {
    console.log("Error while sending mail:", err);
  }
}

module.exports = sendMail;
