import { Model } from 'mongoose';

export type IUser = {
  _id: string;
  id: string;
  role: string;
  password: string;
  phoneNumber: string;
  name: {
    firstName: string;
    lastName: string;
  };
  address: string;
  budget: number;
  income: number;
};

export type UserModel = {
  isUserExist(
    phoneNumber: string,
  ): Promise<Pick<IUser, '_id' | 'id' | 'phoneNumber' | 'password' | 'role'>>;
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string,
  ): Promise<boolean>;
} & Model<IUser>;

// export type UserModel = Model<IUser, Record<string, unknown>>;

export type IUserFilters = {
  searchTerm?: string;
  id?: string;
  role?: string;
  phoneNumber?: string;
  budget?: number;
  income?: number;
};
