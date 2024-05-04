'use server';

import { ApiCollectionEnum, UserRoleEnum } from '@/app/const';
import { getServerSession } from 'next-auth';
import {
  addArrayToCollection,
  addDocument,
  deleteCollection,
  deleteDocument,
  getCollection,
  getDocumentByCondition,
  getDocumentById,
} from './server-only/document-actions';
import { OrderDocType, OrderType } from '@/types/order-types';
import { FieldValue } from 'firebase-admin/firestore';
import { authConfig } from '@/app/api/auth/[...nextauth]/route';

export async function addOrder(order: OrderType) {
  const session = await getServerSession(authConfig);
  if (!session) {
    return { error: 'немає активної сесії', data: null };
  }

  const response = await getDocumentById(
    ApiCollectionEnum.Carts,
    session.user.id
  );

  if (response.error) {
    return { error: response.error, data: null };
  }
  const userCart = response.data?.doc.data();
  const id = response.data?.doc.id;

  if (id !== order.userId) {
    return { error: 'ви не авторизовані для цієї операції', data: null };
  }

  const { error, data } = await addDocument(ApiCollectionEnum.ActiveOrders, {
    ...order,
    createdAt: FieldValue.serverTimestamp(),
    userInfo: userCart?.user,
  });

  if (error) {
    return { error, data: null };
  }

  return { error: null, data: { id: data?.doc?.id } };
}

export async function getUserOrders(collectionName: string) {
  const session = await getServerSession(authConfig);
  if (!session) {
    return { error: 'немає активної сесії', data: null };
  }

  const userId = session.user.id;

  const { error, data } = await getDocumentByCondition(
    collectionName,
    'userId',
    '==',
    userId
  );

  if (error) {
    return { error, data: null };
  }

  if (data) {
    const documents = data.docs
      .map((doc) => {
        return {
          ...doc.data(),
          id: doc.id,
          createdAt: doc.data().createdAt.toDate(),
        };
      })
      .sort((a, b) => b.createdAt - a.createdAt);

    return { error: null, data: documents };
  }
}

export async function getAllOrders(collectionName: string) {
  const session = await getServerSession(authConfig);
  if (!session) {
    return { error: 'немає активної сесії', data: null };
  }
  const { role } = session.user;

  if (role === UserRoleEnum.User) {
    return { error: 'ви не авторизовані для цієї операції', data: null };
  }

  const { error, data } = await getCollection(collectionName);

  if (error) {
    return { error, data: null };
  }
  if (data) {
    const documents = data.docs
      .map((doc) => {
        return {
          ...doc.data(),
          id: doc.id,
          createdAt: doc.data().createdAt.toDate(),
        };
      })
      .sort((a, b) => b.createdAt - a.createdAt);

    return { error: null, data: documents };
  }
}

export async function moveOpenOrderToClosedCollection(id: string) {
  const session = await getServerSession(authConfig);
  if (!session) {
    return { error: 'немає активної сесії', data: null };
  }
  const { role } = session.user;

  if (role === UserRoleEnum.User) {
    return { error: 'ви не авторизовані для цієї операції', data: null };
  }

  const result = await getDocumentById(ApiCollectionEnum.ActiveOrders, id);
  if (result.error) {
    return { error: result.error, data: null };
  }

  const orderId = result.data?.doc.id;
  const openOrder = result.data?.doc.data();

  const response = await addDocument(
    ApiCollectionEnum.ClosedOrders,
    openOrder,
    orderId
  );

  if (response.error) {
    return { error: response.error, data: null };
  }

  const { error, data } = await deleteDocument(
    ApiCollectionEnum.ActiveOrders,
    id
  );

  if (error) {
    return { error, data: null };
  }

  return { error: null, data: { id: data?.id } };
}

export async function moveClosedOrderToOpenCollection(id: string) {
  const session = await getServerSession(authConfig);
  if (!session) {
    return { error: 'немає активної сесії', data: null };
  }
  const { role } = session.user;

  if (role === UserRoleEnum.User) {
    return { error: 'ви не авторизовані для цієї операції', data: null };
  }

  const result = await getDocumentById(ApiCollectionEnum.ClosedOrders, id);
  if (result.error) {
    return { error: result.error, data: null };
  }

  const orderId = result.data?.doc.id;
  const closedOrder = result.data?.doc.data();

  const response = await addDocument(
    ApiCollectionEnum.ActiveOrders,
    closedOrder,
    orderId
  );

  if (response.error) {
    return { error: response.error, data: null };
  }

  const { error, data } = await deleteDocument(
    ApiCollectionEnum.ClosedOrders,
    id
  );

  if (error) {
    return { error, data: null };
  }

  return { error: null, data: { id: data?.id } };
}

export async function moveAllOpenOrdersToClosedCollection(
  orders: OrderDocType[]
) {
  const session = await getServerSession(authConfig);
  if (!session) {
    return { error: 'немає активної сесії', data: null };
  }
  const { role } = session.user;

  if (role === UserRoleEnum.User) {
    return { error: 'ви не авторизовані для цієї операції', data: null };
  }

  const response = await addArrayToCollection(
    ApiCollectionEnum.ClosedOrders,
    orders
  );
  if (response?.error) {
    return { error: response?.error, data: null };
  }

  const { error, data } = await deleteCollection(
    ApiCollectionEnum.ActiveOrders
  );

  if (error) {
    return { error, data: null };
  }
  const deletedOrdersLength = data?.deletedDates.length;
  if (orders.length !== deletedOrdersLength) {
    return { error: 'помилка видалення замовлень', data: null };
  }
}
