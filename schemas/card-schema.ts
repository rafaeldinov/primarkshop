import { z } from 'zod';

export const CardSchema = z.object({
  id: z.string().min(1, { message: `це поле обов'язкове` }),
  price: z.string().min(1, { message: `це поле обов'язкове` }),
  weight: z.string().min(1, { message: `це поле обов'язкове` }),
  category: z.string().min(1, { message: `це поле обов'язкове` }),
  ageCategory: z.string().min(1, { message: `це поле обов'язкове` }),
  gender: z.string().min(1, { message: `це поле обов'язкове` }),
  sizes: z.string().min(1, { message: `це поле обов'язкове` }),
  description: z.string().optional(),
  path: z.string().optional(),
  url: z.string().optional(),
});

export type CardSchemaType = z.infer<typeof CardSchema>;
