import { model, Schema } from 'mongoose';
import { AdminModel, IAdmin } from './admin.interface';
import { NextFunction } from 'express';
import bcrypt from 'bcrypt';
import config from '../../../config';

const adminSchema = new Schema<IAdmin, AdminModel>(
  {
    id: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    name: {
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
    },
    address: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ['admin'],
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

adminSchema.pre('save', async function (next) {
  const user = this;
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  );
  next();
});

adminSchema.statics.isAdminExist = async function (
  phoneNumber: string,
): Promise<IAdmin | null> {
  return Admin.findOne(
    { phoneNumber },
    { phoneNumber: 1, password: 1, role: 1 },
  );
};

adminSchema.statics.isPasswordMatched = async function (
  givenPassword: string,
  savedPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(givenPassword, savedPassword);
};

export const Admin = model<IAdmin, AdminModel>('Admin', adminSchema);
