import httpStatus from 'http-status';
import { User } from '../models/index.js';
import { ApiError } from '../utils/index.js';

/**
 * Create a new user.
 * @param {Object} userBody - The user data to create.
 * @returns {Promise<User>} The created user.
 * @throws {ApiError} If the email is already taken.
 */

const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  return User.create(userBody);
};

/**
 * Insert multiple users into the database.
 * @param {Array<Object>} users - An array of user data to insert.
 * @returns {Promise<Object>} An object containing inserted and failed users.
 */

const bulkInsertUsers = async (users) => {
  const failed = [];
  const inserted = [];

  const emails = users.map((user) => user.email);
  const existingUsers = await User.find({ email: { $in: emails } });
  const existingEmails = new Set(existingUsers.map((user) => user.email));

  const newUsers = [];
  users.forEach((user) => {
    if (existingEmails.has(user.email)) {
      failed.push({ email: user.email, reason: 'Email already taken' });
    } else {
      newUsers.push(user);
    }
  });

  //! ---> Password is not hashed and schema is not validated
  if (newUsers.length > 0) {
    try {
      const insertedUsers = await User.insertMany(newUsers);
      insertedUsers.forEach((user) => inserted.push({ email: user.email }));
    } catch (error) {
      newUsers.forEach((user) => {
        failed.push({ email: user.email, reason: error.message });
      });
    }
  }

  return { inserted, failed };
};

/**
 * Query users with filtering and pagination options.
 * @param {Object} filter - The filter criteria for querying users.
 * @param {Object} options - The pagination options.
 * @returns {Promise<Array<User>>} A paginated list of users.
 */

const queryUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
};

/**
 * Get a user by their ID.
 * @param {string} id - The ID of the user to retrieve.
 * @returns {Promise<User>} The user object.
 * @throws {ApiError} If the user is not found.
 */

const getUserById = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  return user;
};

/**
 * Get a user by their email address.
 * @param {string} email - The email of the user to retrieve.
 * @returns {Promise<User|null>} The user object or null if not found.
 */

const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

/**
 * Update a user's details by their ID.
 * @param {string} userId - The ID of the user to update.
 * @param {Object} updateBody - The updated user data.
 * @returns {Promise<User>} The updated user object.
 * @throws {ApiError} If the email is already taken.
 */

const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Change a user's password.
 * @param {string} userId - The ID of the user.
 * @param {Object} requestBody - The request body containing old and new passwords.
 * @returns {Promise<User>} The updated user object.
 * @throws {ApiError} If the old password is incorrect.
 */

const changePassword = async (userId, requestBody) => {
  const { oldPassword, newPassword } = requestBody;
  const user = await getUserById(userId);
  if (!(await user.isPasswordMatch(oldPassword))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect password');
  }
  const updatedUser = await updateUserById(userId, { password: newPassword });
  return updatedUser;
};

/**
 * Delete a user by their ID.
 * @param {string} userId - The ID of the user to delete.
 * @returns {Promise<User>} The deleted user object.
 */

const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  await user.deleteOne({ _id: userId });
  return user;
};

export default {
  createUser,
  bulkInsertUsers,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  changePassword,
  deleteUserById,
};
