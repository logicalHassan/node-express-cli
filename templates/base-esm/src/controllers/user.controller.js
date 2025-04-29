import fs from 'node:fs';
import csv from 'csv-parser';
import httpStatus from 'http-status';
import userService from '../services/user.service.js';
import { catchAsync, pick, ApiError } from '../utils/index.js';

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const bulkInsertUsers = catchAsync(async (req, res) => {
  if (!req.file) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'File is required');
  }
  const users = [];
  fs.createReadStream(req.file.path)
    .pipe(
      csv({
        separator: ',',
        mapHeaders: ({ header }) => header.trim().toLowerCase(),
      })
    )
    .on('data', (row) => {
      users.push(row);
    })
    .on('end', async () => {
      const result = await userService.bulkInsertUsers(users);
      res.status(httpStatus.CREATED).send(result);
      fs.unlinkSync(req.file.path);
    });
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['search', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});

const getUser = catchAsync(async (req, res) => {
  const userId = req.user.role === 'admin' ? req.params.userId : req.user.id;
  const user = await userService.getUserById(userId);
  res.send(user);
});

const getUserProfile = catchAsync(async (req, res) => {
  const { id } = req.user;
  const user = await userService.getUserById(id);
  res.status(httpStatus.OK).send(user);
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  res.send(user);
});

const updateUserProfile = catchAsync(async (req, res) => {
  const { id } = req.user;

  const updatedUser = req.body.newPassword
    ? await userService.changePassword(id, req.body)
    : await userService.updateUserById(id, req.body);
  res.send(updatedUser);
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

export default {
  createUser,
  bulkInsertUsers,
  getUsers,
  getUser,
  updateUser,
  getUserProfile,
  updateUserProfile,
  deleteUser,
};
