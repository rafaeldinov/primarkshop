import { z } from 'zod';

export const CartItemSchema = z.object({
  sku: z.string().optional(),
  price: z.string().optional(),
  weight: z.string().optional(),
  category: z.string().optional(),
  ageCategory: z.string().optional(),
  gender: z.string().optional(),
  description: z.string().optional(),
  url: z.string().optional(),
  size: z.string().optional(),
  comment: z
    .string()
    .max(300, { message: 'максимальна довжина коментара 300 символів' })
    .optional(),
});

export type CartItemSchemaType = z.infer<typeof CartItemSchema>;
