import Joi from 'joi';
import { objectId, password } from './custom.validation.js';
import { ROLES_ALLOWED } from '../config/roles.js';

const createUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    name: Joi.string().required(),
    role: Joi.string()
      .required()
      .lowercase()
      .valid(...ROLES_ALLOWED),
  }),
};

const getUsers = {
  query: Joi.object().keys({
    email: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    search: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const updateProfile = {
  body: Joi.object().keys({
    email: Joi.string().email(),
    name: Joi.string(),
    newPassword: Joi.string().custom(password),
    oldPassword: Joi.string().custom(password),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      name: Joi.string(),
      role: Joi.string()
        .lowercase()
        .valid(...ROLES_ALLOWED),
      password: Joi.string().custom(password),
    })
    .min(1),
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

export default {
  createUser,
  getUsers,
  getUser,
  updateProfile,
  updateUser,
  deleteUser,
};
