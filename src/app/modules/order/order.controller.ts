import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { OrderService } from './order.service';
import { orderFilterableFields } from './order.constant';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { IOrder } from './order.interface';

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

const getAllOrders = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, orderFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await OrderService.getAllOrders(filters, paginationOptions);
  sendResponse<IOrder[]>(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Orders Retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

export const OrderController = {
  createOrder,
  getAllOrders,
};
