import express from 'express';
import validate from '../middlewares/validate.js';
import auth from '../middlewares/auth.js';
import upload from '../config/multer.js';
import { ADMIN } from '../config/roles.js';
import userController from '../controllers/user.controller.js';
import userValidation from '../validations/user.validation.js';

const router = express.Router();

router
  .route('/')
  .post(auth([ADMIN]), validate(userValidation.createUser), userController.createUser)
  .get(auth([ADMIN]), validate(userValidation.getUsers), userController.getUsers);

router
  .route('/profile')
  .get(auth(), userController.getUserProfile)
  .patch(auth(), validate(userValidation.updateProfile), userController.updateUserProfile);

router.route('/bulk-insert').post(auth([ADMIN]), upload.single('file'), userController.bulkInsertUsers);

router
  .route('/:userId')
  .get(auth(), validate(userValidation.getUser), userController.getUser)
  .patch(auth([ADMIN]), validate(userValidation.updateUser), userController.updateUser)
  .delete(auth([ADMIN]), validate(userValidation.deleteUser), userController.deleteUser);

export default router;
