import { z } from 'zod';

const createUserZodSchema = z.object({
  body: z.object({
    buyer: z.object({
      name: z.object({
        firstName: z.string({
          required_error: 'First name is required',
        }),
        lastName: z.string({
          required_error: 'Last name is required',
        }),
      }),
      password: z.string({ required_error: 'Password is required' }),
      phoneNumber: z.string({ required_error: 'Phone number is required' }),
      address: z.string({ required_error: 'Address is required' }),
      role: z.string({ required_error: 'Role is required' }),
      budget: z.number({ required_error: 'Budget is required' }),
      income: z.number({ required_error: 'Budget is required' }),
    }),
  }),
});

export const UserValidation = {
  createUserZodSchema,
};
