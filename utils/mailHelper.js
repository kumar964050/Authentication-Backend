const nodemailer = require("nodemailer");

async function main({ to, subject, text }) {
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: `"Authentication " ${process.env.SMTP_USER}`,
    to,
    subject,
    text,
  });
  return info;
}

module.exports = main;
