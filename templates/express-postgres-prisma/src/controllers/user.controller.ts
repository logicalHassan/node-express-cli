import httpStatus from 'http-status';
import userService from '@/services/user.service';
import { pick } from '@/utils';
import type { Request, RequestHandler, Response } from 'express';

const createUser: RequestHandler = async (req: Request, res: Response) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
};

const getUsers: RequestHandler = async (req: Request, res: Response) => {
  const query = req.query as Record<string, string>;
  const filter = pick(query, ['name', 'role']);
  const options = pick(query, ['page', 'limit', 'sortBy']);

  const result = await userService.queryUsers(options, filter);
  res.send(result);
};

const getUser: RequestHandler = async (req: Request, res: Response) => {
  const user = await userService.getUserById(req.params.userId);
  res.send(user);
};

const updateUser: RequestHandler = async (req: Request, res: Response) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  res.send(user);
};

const deleteUser: RequestHandler = async (req: Request, res: Response) => {
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
