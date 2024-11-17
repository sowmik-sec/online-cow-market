import { Request, Response } from 'express';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { CowService } from './cow.service';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import { cowFilterableFields } from './cow.constant';
import { paginationFields } from '../../../constants/pagination';
import { ICow } from './cow.interface';

const createCow = catchAsync(async (req: Request, res: Response) => {
  const cow = req.body;
  const result = await CowService.createCow(cow);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Cow saved to db successfully',
    data: result,
  });
});

const getAllCows = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, cowFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await CowService.getAllCows(filters, paginationOptions);
  sendResponse<ICow[]>(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Cows Retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

export const CowController = {
  createCow,
  getAllCows,
};
