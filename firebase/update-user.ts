'use server';

import {
  ServerProfileUpdateSchema,
  ServerProfileUpdateSchemaType,
} from '@/schemas/profile-update-schemas';
import { ApiCollectionEnum } from '@/app/const';
import { getServerSession } from 'next-auth';
import {
  getDocumentById,
  updateDocument,
} from './server-only/document-actions';
import bcrypt from 'bcrypt';
import { authConfig } from '@/app/api/auth/[...nextauth]/route';

export default async function updateUser(data: ServerProfileUpdateSchemaType) {
  const session = await getServerSession(authConfig);
  if (!session) {
    return { error: 'немає активної сесії', data: null };
  }
  const result = ServerProfileUpdateSchema.safeParse(data);

  if (result.success) {
    const userPassword = result.data.password;
    const currentUserData = result.data;

    // check exists signed user by id

    const { id } = session?.user;
    const response = await getDocumentById(ApiCollectionEnum.Users, id);

    if (response.error) {
      return { error: response.error, data: null };
    }
    // check user id from client equal user id from db
    if (id !== response.data?.doc.id) {
      return {
        error: 'помилка валідації | вийдіть з акаунту та знову зайдіть',
        data: null,
      };
    }
    // check user password from client equal user password from db
    if (response.data) {
      const user = response.data.doc.data();
      const userPasswordHash = user?.passwordHash;
      const isPasswordEquals = await bcrypt.compare(
        userPassword,
        userPasswordHash
      );

      if (!isPasswordEquals) {
        return {
          error: 'невірний поточний пароль',
          data: null,
        };
      }
    }
    const { password, ...userData } = currentUserData;

    if (userData.hasOwnProperty('newPassword')) {
      const newPassword = userData.newPassword;
      if (newPassword && newPassword.length > 6) {
        const newPasswordHash = await bcrypt.hash(newPassword, 10);
        Object.assign(userData, { passwordHash: newPasswordHash });
      }
    }

    if (
      userData.email ||
      userData.name ||
      userData.newPassword ||
      userData.phone ||
      userData.shippingTo
    ) {
      const { error, data } = await updateDocument(
        ApiCollectionEnum.Users,
        {
          ...userData,
        },
        id
      );

      if (data) {
        return {
          error,
          data: { updatedAt: data.updatedAt },
        };
      }
      return { error, data: null };
    }
  }

  if (result.success === false) {
    return {
      error: result.error.issues[0].message || 'дані для оновлення не валідні',
      data: null,
    };
  }
}
