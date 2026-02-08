const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendWelcomeEmail = async (to, username) => {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: 'Welcome to BAAD-Shop 🎉',
    html: `
      <h2>Welcome, ${username}!</h2>
      <p>Your account has been successfully created.</p>
      <strong>BAAD-Shop Team</strong>
    `,
  });
};

module.exports = { sendWelcomeEmail };
