import express from 'express';
import auth from '@/middlewares/auth';
import validate from '@/middlewares/validate';
import userController from '@/controllers/user.controller';
import userValidation from '@/validations/user.validation';

const router = express.Router();

router
  .route('/')
  .post(auth(['ADMIN']), validate(userValidation.createUser), userController.createUser)
  .get(auth(['ADMIN']), validate(userValidation.getUsers), userController.getUsers);

router
  .route('/:userId')
  .get(auth(), validate(userValidation.getUser), userController.getUser)
  .patch(auth(['ADMIN']), validate(userValidation.updateUser), userController.updateUser)
  .delete(auth(['ADMIN']), validate(userValidation.deleteUser), userController.deleteUser);

export default router;
