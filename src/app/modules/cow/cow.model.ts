import { model, Schema } from 'mongoose';
import { CowModel, ICow } from './cow.interface';
import {
  cowBreeds,
  cowCategories,
  locations,
  saleStatuses,
} from './cow.constant';

const cowSchema = new Schema<ICow, CowModel>(
  {
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    breed: {
      type: String,
      enum: cowBreeds,
      required: true,
    },
    category: {
      type: String,
      enum: cowCategories,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    label: {
      type: String,
      enum: saleStatuses,
      required: true,
    },
    location: {
      type: String,
      enum: locations,
      required: true,
    },

    seller: {
      type: Schema.Types.ObjectId,
      ref: 'User',
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

export const Cow = model<ICow, CowModel>('Cow', cowSchema);
