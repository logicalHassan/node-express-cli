const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const config = require('../config/config');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user.model');
const { tokenTypes } = require('../config/tokens');

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

module.exports = auth;
