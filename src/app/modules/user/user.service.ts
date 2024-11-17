import ApiError from '../../../errors/ApiErrors';
import { IUser } from './user.interface';
import { User } from './user.model';
import { generateBuyerId, generateSellerId } from './user.utils';

const createUser = async (data: IUser): Promise<IUser> => {
  const isExists = await User.exists({ phoneNumber: data.phoneNumber });
  if (isExists) {
    throw new ApiError(400, 'User already exists');
  }
  if (data.role === 'buyer') {
    const buyerId = await generateBuyerId();
    data.id = buyerId;
  } else {
    const sellerId = await generateSellerId();
    data.id = sellerId;
  }
  const result = await User.create(data);
  return result;
};

export const UserService = {
  createUser,
};
