'use server';

import {
  deleteObject,
  getObjectUrlsAndPathes,
} from './server-only/storage-actions';

export async function getAllImagesUrlsAndPathes(prefix: string) {
  const urlsAndPathes = await getObjectUrlsAndPathes(prefix);
  return urlsAndPathes;
}

export async function deleteImage(path: string) {
  const { error, data } = await deleteObject(path);

  return { error, data: data?.message };
}
