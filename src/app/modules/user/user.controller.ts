import { Request, Response } from 'express';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { UserService } from './user.service';
import catchAsync from '../../../shared/catchAsync';

const createUser = catchAsync(async (req: Request, res: Response) => {
  const { user } = req.body;
  const result = await UserService.createUser(user);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'User Created successfully',
    data: result,
  });
});

export const UserController = {
  createUser,
};
