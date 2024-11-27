import { Request, Response } from 'express';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { UserService } from './user.service';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import { userFilterableFields } from './user.constant';
import { paginationFields } from '../../../constants/pagination';
import { IUser } from './user.interface';

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

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, userFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await UserService.getAllUsers(filters, paginationOptions);
  sendResponse<IUser[]>(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'User Retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await UserService.getSingleUser(id);
  sendResponse<IUser>(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'User Retrieved successfully',
    data: result,
  });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const updatedUser = req.body;
  const result = await UserService.updateUser(id, updatedUser);
  sendResponse<IUser>(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'User updated successfully',
    data: result,
  });
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await UserService.deleteUser(id);
  sendResponse<IUser>(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'User Deleted successfully',
    data: result,
  });
});

const myProfile = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers.authorization;
  const result = await UserService.myProfile(token as string);
  sendResponse<IUser>(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Profile retrieved successfully',
    data: result,
  });
});

export const UserController = {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
  myProfile,
};
