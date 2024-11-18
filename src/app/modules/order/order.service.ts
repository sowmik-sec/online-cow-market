import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiErrors';
import { Cow } from '../cow/cow.model';
import { User } from '../user/user.model';
import { IOrder } from './order.interface';
import mongoose from 'mongoose';
import { Order } from './order.model';

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

export const OrderService = {
  createOrder,
};
