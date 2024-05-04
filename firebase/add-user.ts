'use server';

import { ApiCollectionEnum, UserRoleEnum } from '@/app/const';
import {
  ServerSighupSchema,
  ServerSighupSchemaType,
} from '@/schemas/signup-schemas';
import {
  getDocumentByCondition,
  addDocument,
} from './server-only/document-actions';
import bcrypt from 'bcrypt';

export async function addUser(data: ServerSighupSchemaType) {
  const result = ServerSighupSchema.safeParse(data);

  if (result.success) {
    const user = result.data;
    const candidateEmail = await getDocumentByCondition(
      ApiCollectionEnum.Users,
      'email',
      '==',
      user.email
    );
    const candidatePhone = await getDocumentByCondition(
      ApiCollectionEnum.Users,
      'phone',
      '==',
      user.phone
    );

    if (candidateEmail.data?.docs[0]) {
      if (candidateEmail.data.docs[0].data().email) {
        return { error: 'Користувач з такою поштою вже існує', data: null };
      }
    }

    if (candidatePhone.data?.docs[0]) {
      if (candidatePhone.data.docs[0].data().phone) {
        return { error: 'Користувач з таким номером вже існує', data: null };
      }
    }

    const passwordHash = await bcrypt.hash(user.password, 10);

    const { data, error } = await addDocument(ApiCollectionEnum.Users, {
      name: user.name,
      phone: user.phone,
      email: user.email,
      shippingTo: user.shippingTo,
      passwordHash,
      role: UserRoleEnum.User,
      emailVerified: false,
    });
    if (data) {
      if (data.doc) {
        return { error: null, data: { id: data.doc.id } };
      }
      if (data.id) {
        return { error: null, data: { id: data.id } };
      }
    }
    if (error) {
      return { error, data: null };
    }
  }
  if (result.success === false) {
    return { error: result.error.issues[0].message, data: null };
  }
}
