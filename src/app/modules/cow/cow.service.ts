import ApiError from '../../../errors/ApiErrors';
import { ICow } from './cow.interface';
import { Cow } from './cow.model';

const createCow = async (data: ICow): Promise<ICow> => {
  const result = (await Cow.create(data)).populate('seller');
  return result;
};

export const CowService = {
  createCow,
};
