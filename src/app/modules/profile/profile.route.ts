import express from 'express';
import auth from '../../middlewares/auth';
import { Enum_USER_ROLE } from '../../../enums/user';
import { ProfileController } from './profile.controller';
const router = express.Router();

router.get(
  '/my-profile',
  auth(
    Enum_USER_ROLE.SUPER_ADMIN,
    Enum_USER_ROLE.ADMIN,
    Enum_USER_ROLE.BUYER,
    Enum_USER_ROLE.SELLER,
  ),
  ProfileController.myProfile,
);

const ProfileRoutes = router;
