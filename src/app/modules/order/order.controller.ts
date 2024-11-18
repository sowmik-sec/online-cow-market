import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { OrderService } from './order.service';

const createOrder = catchAsync(async (req: Request, res: Response) => {
  const cow = req.body;
  const result = await OrderService.createOrder(cow);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Buyer made order successfully',
    data: result,
  });
});

export const OrderController = {
  createOrder,
};
