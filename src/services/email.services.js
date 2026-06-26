require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"LedgerX" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

async function sendRegistrationEmail(email, userName) {
  const subject = 'Welcome to LedgerX!';
  const text = `Hi ${userName},\n\nWelcome to LedgerX! Your registration is complete.\n\nBest regards,\nThe LedgerX Team`;
  const html = `
    <p>Hi ${userName},</p>
    <p>Welcome to LedgerX! Your registration is complete.</p>
    <p>Best regards,<br>The LedgerX Team</p>
  `;

  await sendEmail(email, subject, text, html);
}

module.exports = { sendRegistrationEmail };