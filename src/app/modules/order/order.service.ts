import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiErrors';
import { Cow } from '../cow/cow.model';
import { User } from '../user/user.model';
import { IOrder, IOrderFilters } from './order.interface';
import mongoose, { SortOrder } from 'mongoose';
import { Order } from './order.model';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { orderSearchableFields } from './order.constant';
import { Enum_USER_ROLE } from '../../../enums/user';

const createOrder = async (order: IOrder): Promise<IOrder | null> => {
  const cowId = order.cow;
  const buyerId = order.buyer;
  // Fetch the cow and buyer details
  const cow = await Cow.findById(cowId).session(null);
  const buyer = await User.findById(buyerId).session(null);

  // Check if cow or buyer exists
  if (!cow) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Cow not found!');
  }
  if (!buyer) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Buyer not found!');
  }

  const cowPrice = cow?.price as Number;
  const buyerBudget = buyer?.budget as Number;

  if (cowPrice > buyerBudget) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Buyer has insufficient budget',
    );
  }
  const remainingMoney = Number(buyerBudget) - Number(cowPrice);
  let newOrder = null;
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    // Update cow status to 'sold out'
    await Cow.findByIdAndUpdate(cowId, { label: 'sold out' }, { session });

    // Deduct the cow price from the buyer's budget
    await User.findByIdAndUpdate(
      buyerId,
      { budget: remainingMoney },
      { session },
    );

    // Increment seller's income by the cow's price
    await User.findByIdAndUpdate(
      cow.seller,
      { $inc: { income: cowPrice } },
      { session },
    );

    // Create the order within the session
    newOrder = await Order.create([{ cow: cow._id, buyer: buyer._id }], {
      session,
    });
    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }

  // Populate and return the created order
  const populatedOrder = await Order.findById(newOrder[0]._id)
    .populate('cow', 'name breed price') // Populate cow with selected fields
    .populate('buyer', 'name phoneNumber'); // Populate buyer with selected fields

  return populatedOrder;
};

const getAllOrders = async (
  filters: IOrderFilters,
  paginationOptions: IPaginationOptions,
  userRole: string,
  userId: string,
): Promise<IGenericResponse<IOrder[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions: any[] = [];

  // Searchable fields handling
  if (searchTerm) {
    andConditions.push({
      $or: ['cow.name', 'buyer.name'].map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }

  // Filterable fields handling
  if (Object.keys(filtersData).length) {
    Object.entries(filtersData).forEach(([field, value]) => {
      if (field === 'cow' || field === 'buyer') {
        // If filtering by ObjectId fields like cow or buyer
        andConditions.push({
          [field]: value,
        });
      }
    });
  }

  console.log(userRole, userId);
  // Role-based filtering
  if (userRole === Enum_USER_ROLE.BUYER) {
    andConditions.push({ buyer: userId });
  } else if (userRole === Enum_USER_ROLE.SELLER) {
    const cows = await Cow.find({ seller: userId }).select('_id'); // Fetch cow IDs for the seller
    const cowIds = cows.map(cow => cow._id); // Extract the IDs

    andConditions.push({ cow: { $in: cowIds } }); // Match orders where cow is in the seller's list
  }
  // Admin has no additional filters

  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  // Querying the Order model and populating cow and buyer fields
  const result = await Order.find(whereConditions)
    .populate('cow', 'name breed price category location') // Only select necessary fields
    .populate('buyer', 'name phoneNumber role') // Only select necessary fields
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Order.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

export const OrderService = {
  createOrder,
  getAllOrders,
};
