import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiErrors';
import { User } from '../user/user.model';
import {
  IAuth,
  ILoginUserResponse,
  IRefreshTokenResponse,
} from './auth.interface';
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
  const { role } = isUserExist;
  const accessToken = jwtHelpers.createToken(
    { phoneNumber, role },
    config.jwt.secret as Secret,
    config.jwt.jwt_expires_in as string,
  );
  const refreshToken = jwtHelpers.createToken(
    { phoneNumber, role },
    config.jwt.refresh_secret as Secret,
    config.jwt.jwt_refresh_expires_id as string,
  );
  return {
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (token: string): Promise<IRefreshTokenResponse> => {
  let verifiedToken = null;
  try {
    verifiedToken = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_secret as string,
    );
    console.log(verifiedToken);
  } catch (error) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'Invalid refresh token');
  }
  // check deleted user's refresh token
  const { phoneNumber } = verifiedToken;
  const isUserExist = await User.isUserExist(phoneNumber);
  if (!isUserExist) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User does not exist');
  }
  // generate new token
  const newAccessToken = jwtHelpers.createToken(
    {
      phoneNumber,
      role: isUserExist.role,
    },
    config.jwt.secret as Secret,
    config.jwt.jwt_expires_in as string,
  );
  return {
    accessToken: newAccessToken,
  };
};

export const AuthService = {
  loginUser,
  refreshToken,
};
