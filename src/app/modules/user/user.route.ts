import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidation } from './user.validation';
import { UserController } from './user.controller';
const router = express.Router();

router.post(
  '/create-user',
  validateRequest(UserValidation.createUserZodSchema),
  UserController.createUser,
);

router.get('/:id', UserController.getSingleUser);
router.patch(
  '/:id',
  validateRequest(UserValidation.updateUserZodSchema),
  UserController.updateUser,
);

router.delete('/:id', UserController.deleteUser);

router.get('/', UserController.getAllUsers);

export const UserRoutes = router;
