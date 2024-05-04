'use server';

import {
  deleteCollection,
  deleteDocument,
} from './server-only/document-actions';

export async function deleteAllDocumentsInCollection(collectionName: string) {
  const { error, data } = await deleteCollection(collectionName);
  return { error, data };
}

export async function deleteCustomDocument(collectionName: string, id: string) {
  const { error, data } = await deleteDocument(collectionName, id);
  return { error, data };
}
