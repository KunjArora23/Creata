import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();



export const transporter = nodemailer.createTransport({
  service: 'Gmail', // or use 'smtp.ethereal.email' for testing, or your SMTP provider
  auth: {
    user: process.env.SMTP_USER, // your email
    pass: process.env.SMTP_PASS, // your email password or app password
  },
});



export const sendOtpEmail = async (to, otp) => {
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject: 'Your OTP Code',
    html: `<p>Your OTP code is <b>${otp}</b>. It will expire in 10 minutes.</p>`
  });
};

export const sendSignupSuccessEmail = async (to, name) => {
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject: 'Welcome to CredMate!',
    html: `<p>Hi ${name},<br/>Your account has been created successfully. Welcome aboard!</p>`
  });
};