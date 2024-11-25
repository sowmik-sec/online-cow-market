import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { AuthService } from './auth.service';
import config from '../../../config';
import { ILoginUserResponse } from './auth.interface';

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const { ...userData } = req.body;
  const result = await AuthService.loginUser(userData);
  const { refreshToken, ...other } = result;
  const cookieOptions = {
    secure: config.env === 'production',
    httpOnly: true,
  };
  res.cookie('refreshToken', refreshToken, cookieOptions);
  sendResponse<ILoginUserResponse>(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Admin created successfully',
    data: other,
  });
});

export const AuthController = {
  loginUser,
};
