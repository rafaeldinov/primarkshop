import 'server-only';

import { getStorage, getDownloadURL } from 'firebase-admin/storage';
import { initializeAdmin } from './firebaseAdmin';

export async function getObjectUrl(path: string) {
  if (!path) {
    return '';
  }
  const app = await initializeAdmin();
  const bucket = getStorage(app).bucket();
  const file = bucket.file(path);
  try {
    const url = await getDownloadURL(file);
    return url;
  } catch (error) {
    console.log(error);
    return '';
  }
}

export async function deleteObject(path: string) {
  type ApiError = {
    code: number; // 404 not-found
    errors: [
      {
        message: string;
        domain: string;
        reason: string;
      }
    ];
    response: {};
  };
  const app = await initializeAdmin();

  try {
    await getStorage(app).bucket().file(path).delete();
    return { error: null, data: { message: 'успішно видалено' } };
  } catch (error) {
    const typedError = error as ApiError;
    return { error: typedError.errors[0].message, data: null };
  }
}

export async function getObjectUrlsAndPathes(prefix: string) {
  const urlsAndPathes: { path: string; url: string }[] = [];
  const app = await initializeAdmin();
  await getStorage(app)
    .bucket()
    .getFiles({ prefix })
    .then(async (data) => {
      const files = data[0];

      for (let i = 0; i <= files.length - 1; i++) {
        try {
          const url = await getDownloadURL(files[i]);
          urlsAndPathes.push({ path: files[i].name, url });
        } catch (error) {
          continue;
        }
      }
    });

  return urlsAndPathes;
}

export async function checkFileExists(path: string) {
  const app = await initializeAdmin();
  const isExists = await getStorage(app).bucket().file(path).exists();
  return isExists;
}

export async function getDestinationFile(path: string) {
  const app = await initializeAdmin();
  const destination = getStorage(app).bucket().file(path);
  return destination;
}
