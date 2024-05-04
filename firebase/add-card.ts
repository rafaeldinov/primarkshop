'use server';

import { Readable } from 'stream';
import { CardSchemaType } from '@/schemas/card-schema';
import { getDownloadURL } from 'firebase-admin/storage';
import { nanoid } from 'nanoid';
import { addDocument } from './server-only/document-actions';
import {
  ApiCollectionEnum,
  StorageFolderEnum,
  UserRoleEnum,
} from '@/app/const';
import getRole from './get-role';
import { deleteImage } from './user-storage-actions';
import {
  checkFileExists,
  getDestinationFile,
} from './server-only/storage-actions';

export async function addCard(
  formData: CardSchemaType,
  formOnlyWithImage: FormData
) {
  const response = await getRole();

  if (response?.error || response?.data?.role === UserRoleEnum.User) {
    return { error: 'відсутній дозвіл', data: null };
  }

  const file = formOnlyWithImage.get('file') as File;
  const cardData = { ...formData };

  if (formData.hasOwnProperty('path')) {
    const path = formData.path;
    if (path) {
      const isExists = await checkFileExists(path);

      if (isExists[0]) {
        const result = await deleteImage(path);

        if (result?.error) {
          return { error: 'не знайдено', data: null };
        }
      }
    }
  }

  if (file) {
    const uniqId = nanoid();
    const fileName = uniqId + file.name;
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const stream = Readable.from(buffer);
    const path = `${StorageFolderEnum.CardImages}/${fileName}`;
    const destination = await getDestinationFile(path);

    try {
      await new Promise(function (resolve, reject) {
        stream
          .pipe(destination.createWriteStream())
          .on('error', function (err) {
            reject(err);
          })
          .on('finish', function () {
            resolve('uploaded');
          });
      });
    } catch (error) {
      return { error: 'не вдалося завантажити зображення', data: null };
    }

    const url = await getDownloadURL(destination);

    cardData.path = path;
    cardData.url = url;
  } else {
    cardData.path = '';
    cardData.url = '';
  }

  const { error, data } = await addDocument(
    ApiCollectionEnum.Cards,
    { ...cardData },
    formData.id
  );

  if (data) {
    return { error: null, data: { doc: data.doc || data.id } };
  }
  if (error) {
    return { error, data: null };
  }
}
