import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';

const myProfile = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers.authorization;
  console.log(token);
});

export const ProfileController = {
  myProfile,
};
