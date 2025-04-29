import express from 'express';
import validate from '../middlewares/validate.js';
import auth from '../middlewares/auth.js';
import authValidation from '../validations/auth.validation.js';
import authController from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/register', validate(authValidation.register), authController.register);
router.post('/login', validate(authValidation.login), authController.login);
router.post('/logout', validate(authValidation.logout), authController.logout);
router.post('/refresh-tokens', validate(authValidation.refreshTokens), authController.refreshTokens);
router.post('/forgot-password', validate(authValidation.forgotPassword), authController.forgotPassword);
router.post('/reset-password', validate(authValidation.resetPassword), authController.resetPassword);
router.post('/send-verification-email', auth(), authController.sendVerificationEmail);
router.post('/verify-email', auth(), validate(authValidation.verifyEmail), authController.verifyEmail);

export default router;
