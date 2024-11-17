import { SortOrder } from 'mongoose';
import ApiError from '../../../errors/ApiErrors';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { cowSearchableFields } from './cow.constant';
import { ICow, ICowFilters } from './cow.interface';
import { Cow } from './cow.model';

const createCow = async (data: ICow): Promise<ICow> => {
  const result = (await Cow.create(data)).populate('seller');
  return result;
};

const getAllCows = async (
  filters: ICowFilters,
  paginationOptions: IPaginationOptions,
): Promise<IGenericResponse<ICow[]>> => {
  const { searchTerm, minPrice, maxPrice, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);
  const andConditions = [];
  if (searchTerm) {
    andConditions.push({
      $or: cowSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }
  // Price range filter conditions
  if (minPrice !== undefined || maxPrice !== undefined) {
    const priceCondition: { price?: { $gte?: number; $lte?: number } } = {};
    if (minPrice !== undefined) {
      priceCondition.price = {
        ...priceCondition.price,
        $gte: Number(minPrice),
      };
    }
    if (maxPrice !== undefined) {
      priceCondition.price = {
        ...priceCondition.price,
        $lte: Number(maxPrice),
      };
    }
    andConditions.push(priceCondition);
  }
  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }
  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }
  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};
  const result = await Cow.find(whereConditions)
    .populate('seller')
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Cow.countDocuments(whereConditions);
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

export const CowService = {
  createCow,
  getAllCows,
};
