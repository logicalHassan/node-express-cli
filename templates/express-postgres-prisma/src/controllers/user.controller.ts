import userService from '@/services/user.service';
import { pick } from '@/utils';
import type { RequestHandler } from 'express';
import httpStatus from 'http-status';

const createUser: RequestHandler = async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
};

const getUsers: RequestHandler = async (req, res) => {
  const query = req.query as Record<string, string>;
  const options = pick(query, ['page', 'limit', 'sortBy']);
  const filter = pick(query, ['name', 'role']);

  const result = await userService.queryUsers(options, filter);
  res.send(result);
};

const getUser: RequestHandler = async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  res.send(user);
};

const updateUser: RequestHandler = async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  res.send(user);
};

const deleteUser: RequestHandler = async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
};

export default {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
