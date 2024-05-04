'use server';

import { ApiCollectionEnum } from '@/app/const';
import { getDocumentById } from './server-only/document-actions';
import { getServerSession } from 'next-auth';
import bcrypt from 'bcrypt';
import { deleteUser } from './admin-actions';
import { authConfig } from '@/app/api/auth/[...nextauth]/route';

export default async function deleteAccount(password: string) {
  const session = await getServerSession(authConfig);

  if (!session) {
    return { error: 'немає активної сесії', data: null };
  }
  if (password.length < 6 || password.length > 50) {
    return { error: 'пароль не менше 6 і не більше 50 символів', data: null };
  }

  const { id } = session?.user;

  const response = await getDocumentById(ApiCollectionEnum.Users, id);

  if (response.error) {
    return { error: response.error, data: null };
  }
  // check user id from client equal user id from db
  if (id !== response.data?.doc.id) {
    return {
      error: 'помилка валідації | вийдіть та зайдіть знову в акаунт',
      data: null,
    };
  }

  // check user password from client equal user password from db
  if (response.data) {
    const user = response.data.doc.data();
    const userPasswordHash = user?.passwordHash;
    const isPasswordEquals = await bcrypt.compare(password, userPasswordHash);
    if (!isPasswordEquals) {
      return {
        error: 'невірний поточний пароль',
        data: null,
      };
    }
  }

  const result = await deleteUser(id, { roleIgnore: true });

  if (result?.data) {
    return { error: null, data: result?.data };
  }
  return { error: result.error, data: null };
}
