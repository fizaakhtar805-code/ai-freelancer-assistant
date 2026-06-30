const nodemailer = require("nodemailer")

const sendEmail = async (to, subject, html) => {
  // Set up the connection to Gmail
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })

  // Send the email
  await transporter.sendMail({
    from: `"AI Freelancer Assistant" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  })
}

module.exports = sendEmail