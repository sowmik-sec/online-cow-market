import { Model, Types } from 'mongoose';

export type IUser = {
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

export type UserModel = Model<IUser, Record<string, unknown>>;

export type IUserFilters = {
  searchTerm?: string;
  id?: string;
  role?: string;
  phoneNumber?: string;
  budget?: number;
  income?: number;
};
