import { z } from 'zod';
import {
  cowBreeds,
  cowCategories,
  locations,
  saleStatuses,
} from './cow.constant';

// Zod schema for creating a cow
const createCowZodSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Name is required',
    }),
    age: z
      .number({
        required_error: 'Age is required',
      })
      .min(0, 'Age cannot be negative'),
    weight: z
      .number({
        required_error: 'Weight is required',
      })
      .min(0, 'Weight cannot be negative'),
    breed: z.enum([...cowBreeds] as [string, ...string[]], {
      required_error: 'Breed is required',
    }),
    category: z.enum([...cowCategories] as [string, ...string[]], {
      required_error: 'Category is required',
    }),
    price: z
      .number({
        required_error: 'Price is required',
      })
      .min(0, 'Price cannot be negative'),
    label: z.enum([...saleStatuses] as [string, ...string[]], {
      required_error: 'Sale status is required',
    }),
    location: z.enum([...locations] as [string, ...string[]], {
      required_error: 'Location is required',
    }),
    seller: z
      .string({
        required_error: 'Seller ID is required',
      })
      .regex(/^[a-fA-F0-9]{24}$/, 'Invalid seller ID format'),
  }),
});

// Zod schema for updating a cow (all fields optional)
const updateCowZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    age: z.number().min(0).optional(),
    weight: z.number().min(0).optional(),
    breed: z.enum([...cowBreeds] as [string, ...string[]]).optional(),
    category: z.enum([...cowCategories] as [string, ...string[]]).optional(),
    price: z.number().min(0).optional(),
    label: z.enum([...saleStatuses] as [string, ...string[]]).optional(),
    location: z.enum([...locations] as [string, ...string[]]).optional(),
    seller: z
      .string()
      .regex(/^[a-fA-F0-9]{24}$/, 'Invalid seller ID format')
      .optional(),
  }),
});

export const CowValidation = {
  createCowZodSchema,
  updateCowZodSchema,
};
