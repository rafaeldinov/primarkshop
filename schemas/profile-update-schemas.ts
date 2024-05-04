import { z } from 'zod';

export const ProfileUpdateSchema = z.object({
  name: z
    .string()
    .max(100, { message: 'максимальна довжина 100 символів' })
    .optional(),
  shippingTo: z
    .string()
    .max(200, { message: 'максимальна довжина 200 символів' })
    .optional(),
  phone: z
    .string()
    .length(15, {
      message: 'напишіть номер повністю або залиште незаповненним',
    })
    .optional()
    .or(z.literal('')),
  email: z
    .string()
    .email('напишіть правильно пошту')
    .max(100, { message: 'максимальна довжина 100 символів' })
    .optional()
    .or(z.literal('')),
  newPassword: z
    .string()
    .min(6, { message: 'не менше 6 символів' })
    .max(50, { message: 'максимальна довжина 50 символів' })
    .optional()
    .or(z.literal('')),
  password: z
    .string()
    .min(6, { message: 'не менше 6 символів' })
    .max(50, { message: 'максимальна довжина 50 символів' }),
});

export type ProfileUpdateSchemaType = z.infer<typeof ProfileUpdateSchema>;

export const ServerProfileUpdateSchema = ProfileUpdateSchema.extend({
  phone: z
    .string()
    .length(13, { message: 'невірна кількість симолів' })
    .regex(/^\+?3?8?(0\d{9})$/, 'невірний формат номеру телефона')
    .optional()
    .or(z.literal('')),
}).refine(
  (data) =>
    !!data.name ||
    !!data.shippingTo ||
    !!data.phone ||
    !!data.email ||
    !!data.newPassword,
  { message: 'Для оновлення потрібно заповнити хоча б одне поле форми' }
);

export type ServerProfileUpdateSchemaType = z.infer<
  typeof ServerProfileUpdateSchema
>;
