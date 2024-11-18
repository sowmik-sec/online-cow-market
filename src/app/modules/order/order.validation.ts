import { z } from 'zod';

const createOrderZodSchema = z.object({
  body: z.object({
    cow: z.string({ required_error: 'Cow Id is required' }),
    buyer: z.string({ required_error: 'Buyer Id is required' }),
  }),
});

export const OrderValidation = {
  createOrderZodSchema,
};
