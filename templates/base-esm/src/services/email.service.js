import nodemailer from 'nodemailer';
import config from '../config/config.js';
import logger from '../config/logger.js';
import { PASSWORD_RESET_REQUEST, PASSWORD_RESET_SUCCESS, VERIFICATION_EMAIL } from '../utils/emailTemplates.js';

// Nodemailer transport instance with SMTP configuration
const transport = nodemailer.createTransport(config.email.smtp);
if (config.env !== 'test') {
  transport
    .verify()
    .then(() => logger.info('Connected to email server'))
    .catch(() => logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));
}

// Send an email
const sendEmail = async (to, subject, html) => {
  const msg = { from: config.email.from, to, subject, html };
  await transport.sendMail(msg);
};

// Send reset password email
const sendResetPasswordEmail = async (to, token) => {
  const subject = 'Reset password';
  const resetPasswordUrl = `${config.frontend.url}/reset-password?token=${token}`;
  const html = PASSWORD_RESET_REQUEST(resetPasswordUrl);
  await sendEmail(to, subject, html);
};

// Notify the user of a successful password reset
const sendPasswordRestSuccessEmail = async (to) => {
  const subject = 'Password reset successful';
  const html = PASSWORD_RESET_SUCCESS;
  await sendEmail(to, subject, html);
};

// Send verification email
const sendVerificationEmail = async (to, otp) => {
  const subject = 'Email Verification';
  const html = VERIFICATION_EMAIL(otp);
  await sendEmail(to, subject, html);
};

export default {
  transport,
  sendEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
  sendPasswordRestSuccessEmail,
};
