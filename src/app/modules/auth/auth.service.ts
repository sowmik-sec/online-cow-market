import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiErrors';
import { User } from '../user/user.model';
import { IAuth, ILoginUserResponse } from './auth.interface';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import config from '../../../config';
import { Secret } from 'jsonwebtoken';

const loginUser = async (data: IAuth): Promise<ILoginUserResponse> => {
  const { phoneNumber, password } = data;
  const isUserExist = await User.isUserExist(phoneNumber);
  if (!isUserExist) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  }
  const isPasswordMatched = await User.isPasswordMatched(
    password,
    isUserExist.password,
  );
  if (!isPasswordMatched) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized user');
  }
  const { phoneNumber: userPhoneNumber, role } = isUserExist;
  const accessToken = jwtHelpers.createToken(
    { userPhoneNumber, role },
    config.jwt.secret as Secret,
    config.jwt.jwt_expires_in as string,
  );
  const refreshToken = jwtHelpers.createToken(
    { userPhoneNumber, role },
    config.jwt.refresh_secret as Secret,
    config.jwt.jwt_refresh_expires_id as string,
  );
  return {
    accessToken,
    refreshToken,
  };
};

export const AuthService = {
  loginUser,
};
