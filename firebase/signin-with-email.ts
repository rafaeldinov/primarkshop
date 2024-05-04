'use server';

import { ApiCollectionEnum } from '@/app/const';
import { getDocumentByCondition } from './server-only/document-actions';
import bcrypt from 'bcrypt';
import { z } from 'zod';

export default async function signinWithEmailAndPassword(
  email: string,
  password: string
) {
  // parse user data
  const UserSchema = z.object({
    email: z
      .string()
      .min(4, { message: `введіть пошту` })
      .email({ message: 'напишіть правильно пошту' }),
    password: z
      .string()
      .min(6, { message: `введіть пароль` })
      .max(50, { message: `максимум 50 символів` }),
  });
  const result = UserSchema.safeParse({ email, password });
  if (!result.success) {
    return { error: result.error, data: null };
  }

  // get user data by email
  const response = await getDocumentByCondition(
    ApiCollectionEnum.Users,
    'email',
    '==',
    email
  );
  // compare passwords
  if (response.data) {
    const doc = response.data.docs[0].data();
    const userPasswordHash = doc.passwordHash;
    const isPasswordEquals = await bcrypt.compare(password, userPasswordHash);

    if (isPasswordEquals) {
      return { error: null, data: { doc: response.data.docs[0] } };
    }
    return { error: 'невірний пароль', data: null };
  }
  return { error: 'користувач не знайдений', data: null };
}
