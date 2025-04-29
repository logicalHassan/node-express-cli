const crypto = require('crypto');

function generateRandomOtp(length = 6) {
  const buffer = crypto.randomBytes(length);
  const otp = buffer.toString('hex');
  const numericOtp = parseInt(otp, 16).toString();
  const lastSixDigits = numericOtp.slice(-6);
  return lastSixDigits;
}

module.exports = generateRandomOtp;
