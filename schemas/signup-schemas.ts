import { z } from 'zod';

export const SighupSchema = z.object({
  name: z
    .string()
    .min(1, { message: `це поле обов'язкове` })
    .max(100, { message: 'максимальна довжина 100 символів' }),
  shippingTo: z
    .string()
    .min(1, { message: `це поле обов'язкове` })
    .max(200, { message: 'максимальна довжина 200 символів' }),
  phone: z.string().length(15, {
    message: 'напишіть номер повністю',
  }),
  email: z
    .string()
    .min(1, { message: `це поле обов'язкове` })
    .max(100, { message: 'максимальна довжина 100 символів' })
    .email({ message: 'напишіть правильно пошту' }),
  password: z
    .string()
    .min(1, { message: `це поле обов'язкове` })
    .min(6, { message: 'не менше 6 символів' })
    .max(50, { message: 'максимальна довжина 50 символів' }),
});

export type SighupSchemaType = z.infer<typeof SighupSchema>;

export const ServerSighupSchema = SighupSchema.extend({
  phone: z
    .string()
    .length(13, { message: 'невірна кількість симолів' })
    .regex(/^\+?3?8?(0\d{9})$/, 'невірний формат номеру телефона'),
});

export type ServerSighupSchemaType = z.infer<typeof ServerSighupSchema>;
