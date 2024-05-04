'use server';

import { ApiCollectionEnum } from '@/app/const';
import { getServerSession } from 'next-auth';
import {
  getDocumentById,
  updateDocument,
} from './server-only/document-actions';
import { CartItemSchemaType } from '@/schemas/cart-item-schema';
import { firestore } from 'firebase-admin';
import { authConfig } from '@/app/api/auth/[...nextauth]/route';

export async function clearCart() {
  const session = await getServerSession(authConfig);
  if (!session) {
    return { error: 'немає активної сесії', data: null };
  }

  const { id } = session.user;

  const docData = {
    cartItems: [],
  };

  const { error } = await updateDocument(ApiCollectionEnum.Carts, docData, id);

  if (error) {
    return { error, data: null };
  }
  return { error: null, data: { id } };
}

export async function getCart() {
  const session = await getServerSession(authConfig);
  if (!session) {
    return { error: 'немає активної сесії', data: null };
  }
  const { error, data } = await getDocumentById(
    ApiCollectionEnum.Carts,
    session.user.id
  );
  if (error) {
    return { error, data: null };
  }
  if (data) {
    const cart = JSON.parse(
      JSON.stringify({ ...data.doc.data(), userId: data.doc.id })
    );

    return { error: null, data: { doc: cart } };
  }
  return { error: 'помилка отримання кошика', data: null };
}

export async function addToCart(data: CartItemSchemaType[]) {
  // check is active user session
  const session = await getServerSession(authConfig);
  if (!session) {
    return { error: 'немає активної сесії', data: null };
  }
  const { id } = session.user;

  const docData = {
    cartItems: data,
  };

  const result = await updateDocument(
    ApiCollectionEnum.Carts,
    docData,
    id,
    false
  );

  if (result.error) {
    return { error: result.error, data: null };
  }
  if (result.data) {
    return { error: null, data: { updateAt: result.data.updatedAt } };
  }
  return {
    error: 'помилка сервера при додаванні товару до кошика',
    data: null,
  };
}

export async function removeFromCart(element: CartItemSchemaType) {
  const session = await getServerSession(authConfig);
  if (!session) {
    return { error: 'немає активної сесії', data: null };
  }

  const { id } = session.user;

  const data = { cartItems: firestore.FieldValue.arrayRemove(element) };

  const result = await updateDocument(ApiCollectionEnum.Carts, data, id, false);

  if (result.error) {
    return { error: result.error, data: null };
  }
  if (result.data) {
    return { error: null, data: { updateAt: result.data.updatedAt } };
  }
  return {
    error: 'помилка сервера при додаванні товару до кошика',
    data: null,
  };
}
