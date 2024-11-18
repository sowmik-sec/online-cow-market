import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { OrderValidation } from './order.validation';
import { OrderController } from './order.controller';
const router = express.Router();

router.post(
  '/',
  validateRequest(OrderValidation.createOrderZodSchema),
  OrderController.createOrder,
);

router.get('/', OrderController.getAllOrders);

export const OrderRoutes = router;
