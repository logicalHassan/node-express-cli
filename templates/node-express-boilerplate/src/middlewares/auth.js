const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const ApiError = require('../utils/api-error');
const env = require('../config/env');
const catchAsync = require('../utils/catch-async');
const { tokenTypes } = require('../config/tokens');
const { userService } = require('../services');

/**
 * Middleware to authenticate a JWT token and attach the user to the request object.
 */
const authenticateToken = async (req) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'No token provided');
  }

  let decoded;

  try {
    decoded = jwt.verify(token, env.jwt.secret);
  } catch {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid or expired token');
  }

  if (decoded.type !== tokenTypes.ACCESS) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token type');
  }

  const user = await userService.getUserById(decoded.sub);

  req.user = user;
};

/**
 * Authorization middleware that checks if the authenticated user has the required role.
 */
const auth = (requiredRoles = []) =>
  catchAsync(async (req, res, next) => {
    await authenticateToken(req);
    const { role } = req.user;

    if (requiredRoles.lenght && !requiredRoles.includes(role)) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Access denied, Role not allowed');
    }

    next();
  });

module.exports = auth;
