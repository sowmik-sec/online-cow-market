import { Model } from 'mongoose';

export type IAdmin = {
  id: string;
  phoneNumber: string;
  role: 'admin';
  password: string;
  name: {
    firstName: string;
    lastName: string;
  };
  address: string;
};

export type AdminModel = {
  isAdminExist(
    phoneNumber: string,
  ): Promise<Pick<IAdmin, 'phoneNumber' | 'password' | 'role'>>;
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string,
  ): Promise<boolean>;
} & Model<IAdmin>;

export type ILoginAdmin = {
  phoneNumber: string;
  password: string;
};

export type ILoginAdminResponse = {
  accessToken: string;
  refreshToken?: string;
};

export type IRefreshTokenResponse = {
  accessToken: string;
};
