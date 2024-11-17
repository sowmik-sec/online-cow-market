import { z } from 'zod';

const createUserZodSchema = z.object({
  body: z.object({
    user: z.object({
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

const updateUserZodSchema = z.object({
  body: z.object({
    user: z
      .object({
        name: z
          .object({
            firstName: z
              .string({
                required_error: 'First name is required',
              })
              .optional(),
            lastName: z
              .string({
                required_error: 'Last name is required',
              })
              .optional(),
          })
          .optional(),
        password: z
          .string({ required_error: 'Password is required' })
          .optional(),
        phoneNumber: z
          .string({ required_error: 'Phone number is required' })
          .optional(),
        address: z.string({ required_error: 'Address is required' }).optional(),
        role: z.string({ required_error: 'Role is required' }).optional(),
        budget: z.number({ required_error: 'Budget is required' }).optional(),
        income: z.number({ required_error: 'Income is required' }).optional(),
      })
      .optional(),
  }),
});

export const UserValidation = {
  createUserZodSchema,
  updateUserZodSchema,
};
