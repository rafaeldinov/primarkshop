'use server';

import { ApiCollectionEnum } from '@/app/const';
import { getServerSession } from 'next-auth';
import { getDocumentById } from './server-only/document-actions';
import { authConfig } from '@/app/api/auth/[...nextauth]/route';

export default async function getRole() {
  const session = await getServerSession(authConfig);
  if (!session) {
    return { error: 'немає активної сесії', data: null };
  }
  const { id } = session.user;
  if (id) {
    const { error, data } = await getDocumentById(ApiCollectionEnum.Users, id);
    if (error) {
      return { error, data: null };
    }
    if (data) {
      const user = data.doc.data();
      return { error: null, data: { role: user?.role } };
    }
  }
}
