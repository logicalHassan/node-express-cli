const httpStatus = require('http-status');
const Otp = require('../models/otp.model');
const ApiError = require('../utils/ApiError');
const generateRandomOtp = require('../utils/generateOtp');
const { userService } = require('.');

const OTP_EXPIRATION_MS = 2 * 60 * 1000; // 2 minutes

/**
 * Find OTP document by user ID.
 * @param {string} userId - ID of the user.
 * @returns {Promise<Otp>} The OTP document associated with the user.
 * @throws {ApiError} If no OTP document is found.
 */

const findOtpByUserId = async (userId) => {
  const otpDoc = await Otp.findOne({ userId });
  if (!otpDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No otp found for this user.');
  }
  return otpDoc;
};

/**
 * Delete OTP document by user ID.
 * @param {string} userId - ID of the user.
 * @returns {Promise<void>}
 */

const deleteOtp = async (userId) => {
  await Otp.deleteOne({ userId });
};

/**
 * Generate a new OTP and save it to the database.
 * @param {string} userId - ID of the user.
 * @returns {Promise<string>} The generated OTP.
 */

const generateAndSaveOtp = async (userId) => {
  const otpExists = await Otp.findOne({ userId });
  if (otpExists) {
    await deleteOtp(userId);
  }
  const otp = generateRandomOtp();
  await Otp.create({ userId, otp });
  return otp;
};

/**
 * Verify if the provided OTP is correct and not expired.
 * @param {string} userId - ID of the user.
 * @param {string} otp - The OTP provided by the user.
 * @returns {Promise<void>}
 * @throws {ApiError} If the OTP is invalid or expired.
 */

const verifyOtp = async (userId, otp) => {
  const otpDoc = await findOtpByUserId(userId);
  const currentTime = Date.now();
  const isOtpExpired = currentTime >= otpDoc.createdAt.getTime() + OTP_EXPIRATION_MS;

  if (isOtpExpired) {
    await deleteOtp(userId);
    throw new ApiError(httpStatus.BAD_REQUEST, 'OTP has expired. Please request a new one.');
  }

  if (otpDoc.otp !== otp) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid OTP.');
  }

  await userService.updateUserById(userId, { isEmailVerified: true });
  await deleteOtp(userId);
};

module.exports = {
  generateAndSaveOtp,
  verifyOtp,
};
