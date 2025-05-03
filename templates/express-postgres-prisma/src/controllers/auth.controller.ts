import httpStatus from 'http-status';
import type { Request, RequestHandler, Response } from 'express';
import { authService, tokenService, emailService } from '@/services';

const login: RequestHandler = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
};

const logout: RequestHandler = async (req: Request, res: Response) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.OK).send({ success: true, message: 'User Logout Successfully!' });
};

const forgotPassword: RequestHandler = async (req: Request, res: Response) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
};

const refreshTokens: RequestHandler = async (req: Request, res: Response) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
};

const resetPassword: RequestHandler = async (req: Request, res: Response) => {
  const updatedUser = await authService.resetPassword(req.query.token as string, req.body.password);
  await emailService.sendPasswordRestSuccessEmail(updatedUser.email);
  res.status(httpStatus.NO_CONTENT).send();
};

const sendVerificationEmail: RequestHandler = async (req: Request, res: Response) => {
  const user = req.user!;
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(user);
  await emailService.sendVerificationEmail(user.email, verifyEmailToken);
  res.status(httpStatus.NO_CONTENT).send();
};

const verifyEmail: RequestHandler = async (req: Request, res: Response) => {
  await authService.verifyEmail(req.query.token as string);
  res.status(httpStatus.NO_CONTENT).send();
};

export default {
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
};
