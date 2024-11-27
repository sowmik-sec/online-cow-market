import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidation } from './user.validation';
import { UserController } from './user.controller';
import auth from '../../middlewares/auth';
import { Enum_USER_ROLE } from '../../../enums/user';
const router = express.Router();

router.post(
  '/create-user',
  validateRequest(UserValidation.createUserZodSchema),
  UserController.createUser,
);

router.get(
  '/my-profile',
  auth(Enum_USER_ROLE.BUYER, Enum_USER_ROLE.SELLER),
  UserController.myProfile,
);

router.get('/:id', auth(Enum_USER_ROLE.ADMIN), UserController.getSingleUser);
router.patch(
  '/:id',
  validateRequest(UserValidation.updateUserZodSchema),
  auth(Enum_USER_ROLE.ADMIN),
  UserController.updateUser,
);

router.delete('/:id', auth(Enum_USER_ROLE.ADMIN), UserController.deleteUser);

router.get('/', auth(Enum_USER_ROLE.ADMIN), UserController.getAllUsers);

export const UserRoutes = router;
