import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { AuthService } from './auth.service';

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const { ...userData } = req.body;
  const result = await AuthService.loginUser(userData);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Admin created successfully',
    data: result,
  });
});

export const AuthController = {
  loginUser,
};
