import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import config from '../config/config.js';
import User from '../models/user.model.js';
import tokenTypes from '../config/tokens.js';
import { ApiError, catchAsync } from '../utils/index.js';

/**
 * Middleware to authenticate a JWT token and attach the user to the request object.
 */
const authenticateToken = async (req) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'No token provided');
  }

  const payload = jwt.verify(token, config.jwt.secret);

  if (payload.type !== tokenTypes.ACCESS) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token type');
  }

  const user = await User.findById(payload.sub);

  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'User not found');
  }

  req.user = user;
};

/**
 * Authorization middleware that checks if the authenticated user has the required role.
 */
const auth = (requiredRoles = []) =>
  catchAsync(async (req, res, next) => {
    await authenticateToken(req, res);
    const { role } = req.user;

    if (!requiredRoles.lenght && !requiredRoles.includes(role)) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Access denied, Role not allowed');
    }

    next();
  });

export default auth;
