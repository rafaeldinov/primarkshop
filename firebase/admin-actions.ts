'use server';

import { ApiCollectionEnum, UserRoleEnum } from '@/app/const';
import {
  deleteByCondition,
  deleteDocument,
  getCollection,
  updateDocument,
} from './server-only/document-actions';
import { getServerSession } from 'next-auth';
import { UserDocType, UserStoreType } from '@/types/user-types';
import { authConfig } from '@/app/api/auth/[...nextauth]/route';

export async function getAllUsers() {
  const session = await getServerSession(authConfig);
  if (!session) {
    return { error: 'немає активної сесії', data: null };
  }
  const { role } = session.user;
  if (role !== UserRoleEnum.Admin) {
    return { error: 'ви не авторизовані для цієї операції', data: null };
  }

  const { error, data } = await getCollection(ApiCollectionEnum.Users);

  if (error) {
    return { error, data: null };
  }

  if (data) {
    const users: UserDocType[] = data.docs.map((doc) =>
      JSON.parse(
        JSON.stringify({
          ...doc.data(),
          id: doc.id,
          createdAt: doc.createTime.toDate(),
        })
      )
    );

    const usersWithoutPasswordHash = [];

    for (const user of users) {
      const { passwordHash, verifyEmailToken, ...newUser } = user;
      usersWithoutPasswordHash.push(newUser);
    }

    return {
      error: null,
      data: { docs: usersWithoutPasswordHash as UserStoreType[] },
    };
  }
}

export async function deleteUser(id: string, status?: { roleIgnore: boolean }) {
  const session = await getServerSession(authConfig);
  if (!session) {
    return { error: 'немає активної сесії', data: null };
  }

  const { role } = session.user;

  if (role !== UserRoleEnum.Admin && !status?.roleIgnore) {
    return { error: 'ви не авторизовані для цієї операції', data: null };
  }

  const responseDeleteUserProfile = await deleteDocument(
    ApiCollectionEnum.Users,
    id
  ); // if success return id

  if (!responseDeleteUserProfile.data) {
    return { error: 'помилка при видаленні користувача', data: null };
  }
  const responseDeleteUserCart = await deleteDocument(
    ApiCollectionEnum.Carts,
    id
  ); // if success return id

  if (!responseDeleteUserCart.data) {
    return { error: 'помилка при видаленні кошика користувача', data: null };
  }

  const responseDeleteUserOpenOrders = await deleteByCondition(
    ApiCollectionEnum.ActiveOrders,
    'userId',
    '==',
    id
  ); // if success return array of deletedAtDates or empty array / error always null

  const responseDeleteUserClosedOrders = await deleteByCondition(
    ApiCollectionEnum.ClosedOrders,
    'userId',
    '==',
    id
  ); // if success return array of deletedAtDates or empty array / error always null

  return { error: null, data: 'успішно видалено' };
}

export async function changeRole(userRole: string, id: string) {
  const session = await getServerSession(authConfig);
  if (!session) {
    return { error: 'немає активної сесії', data: null };
  }
  const { role } = session.user;

  if (role !== UserRoleEnum.Admin) {
    return { error: 'ви не авторизовані для цієї операції', data: null };
  }

  const newRole = { role: userRole };

  const { error, data } = await updateDocument(
    ApiCollectionEnum.Users,
    newRole,
    id
  );

  if (error) {
    return { error, data: null };
  }

  return { error: null, data: { updatedAt: data?.updatedAt } };
}
