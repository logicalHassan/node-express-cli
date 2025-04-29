const express = require('express');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const userValidation = require('../validations/user.validation');
const userController = require('../controllers/user.controller');
const upload = require('../config/multer');
const { ADMIN } = require('../config/roles');

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

module.exports = router;
