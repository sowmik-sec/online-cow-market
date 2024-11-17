import { Request, Response } from 'express';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { CowService } from './cow.service';

const createCow = async (req: Request, res: Response) => {
  const cow = req.body;
  const result = await CowService.createCow(cow);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Cow saved to db successfully',
    data: result,
  });
};

export const CowController = {
  createCow,
};
