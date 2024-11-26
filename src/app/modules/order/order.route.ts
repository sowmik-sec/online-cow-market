import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { OrderValidation } from './order.validation';
import { OrderController } from './order.controller';
import auth from '../../middlewares/auth';
import { Enum_USER_ROLE } from '../../../enums/user';
const router = express.Router();

router.post(
  '/',
  validateRequest(OrderValidation.createOrderZodSchema),
  auth(Enum_USER_ROLE.BUYER),
  OrderController.createOrder,
);

router.get('/', auth(Enum_USER_ROLE.ADMIN), OrderController.getAllOrders);

export const OrderRoutes = router;
