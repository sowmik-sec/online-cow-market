import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiErrors';
import { IAdmin, ILoginAdmin, ILoginAdminResponse } from './admin.interface';
import { Admin } from './admin.mode';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import config from '../../../config';
import { Secret } from 'jsonwebtoken';
import { generateAdminId } from './admin.utils';

const createAdmin = async (data: IAdmin): Promise<IAdmin> => {
  const isExists = await Admin.exists({ id: data.id });
  if (isExists) {
    throw new ApiError(400, 'Admin already exists');
  }
  const adminId = await generateAdminId();
  data.id = adminId;
  const result = await Admin.create(data);
  return result;
};

const loginAdmin = async (
  payload: ILoginAdmin,
): Promise<ILoginAdminResponse> => {
  const { id, password } = payload;
  const isAdminExist = await Admin.isAdminExist(id);
  if (!isAdminExist) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Admin not found');
  }
  if (
    isAdminExist.password &&
    !(await Admin.isPasswordMatched(password, isAdminExist.password))
  ) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Password is incorrect');
  }
  const { role } = isAdminExist;
  const accessToken = jwtHelpers.createToken(
    { id, role },
    config.jwt.secret as Secret,
    config.jwt.jwt_expires_in as string,
  );
  const refreshToken = jwtHelpers.createToken(
    { id, role },
    config.jwt.refresh_secret as Secret,
    config.jwt.jwt_refresh_expires_id as string,
  );
  return {
    accessToken,
    refreshToken,
  };
};

export const AdminService = {
  createAdmin,
  loginAdmin,
};
