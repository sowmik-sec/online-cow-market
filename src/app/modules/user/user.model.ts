import { model, Schema, UpdateQuery } from 'mongoose';
import { IUser, UserModel } from './user.interface';
import { role } from './user.constant';
import config from '../../../config';
import bcrypt from 'bcrypt';

const userSchema = new Schema<IUser, UserModel>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: role,
      required: true,
    },
    address: {
      type: String,
      required: true,
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
    income: {
      type: Number,
    },
    budget: {
      type: Number,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

userSchema.pre('save', async function (next) {
  const user = this;
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  );
  next();
});
userSchema.pre('updateOne', async function (next) {
  const update = this.getUpdate();

  if (update && typeof update === 'object' && 'password' in update) {
    const hashedPassword = await bcrypt.hash(
      (update as UpdateQuery<any>).password,
      Number(config.bcrypt_salt_rounds),
    );
    (update as UpdateQuery<any>).password = hashedPassword;
  }

  next();
});

userSchema.statics.isUserExist = async function (
  phoneNumber: string,
): Promise<IUser | null> {
  return User.findOne(
    { phoneNumber },
    { _id: 1, id: 1, phoneNumber, password: 1, role: 1 },
  );
};

userSchema.statics.isPasswordMatched = async function (
  givenPassword: string,
  savedPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(givenPassword, savedPassword);
};

export const User = model<IUser, UserModel>('User', userSchema);
