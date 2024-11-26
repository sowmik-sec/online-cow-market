import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { CowValidation } from './cow.validation';
import { CowController } from './cow.controller';
import auth from '../../middlewares/auth';
import { Enum_USER_ROLE } from '../../../enums/user';
const router = express.Router();

router.post(
  '/create-cow',
  validateRequest(CowValidation.createCowZodSchema),
  auth(Enum_USER_ROLE.SELLER),
  CowController.createCow,
);

router.get(
  '/:id',
  auth(Enum_USER_ROLE.ADMIN, Enum_USER_ROLE.BUYER, Enum_USER_ROLE.SELLER),
  CowController.getSingleCow,
);
router.patch(
  '/:id',
  validateRequest(CowValidation.updateCowZodSchema),
  auth(Enum_USER_ROLE.SELLER),
  CowController.updateCow,
);
router.delete('/:id', auth(Enum_USER_ROLE.SELLER), CowController.deleteCow);

router.get(
  '/',
  auth(Enum_USER_ROLE.ADMIN, Enum_USER_ROLE.BUYER, Enum_USER_ROLE.SELLER),
  CowController.getAllCows,
);

export const CowRoutes = router;
