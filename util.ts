import { Timestamp } from 'firebase/firestore';
import { fileTypes } from './app/const';
import { customAlphabet } from 'nanoid';
import ShortUniqueId from 'short-unique-id';

const alphabet =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_-=abcdefghigklmnopqrstuvwxyz';
export const generator = customAlphabet(alphabet, 15);

export const generateId = () => {
  const { randomUUID } = new ShortUniqueId({ length: 10 });
  const firstPartId = randomUUID();
  const secondPartId = Math.floor(Math.random() * Date.now()).toString(16);
  const id = firstPartId + secondPartId;
  return id;
};

export function validFileType(file: File) {
  return fileTypes.includes(file.type);
}

export function getFileSize(number: number) {
  if (number < 1024) {
    return `${number} bytes`;
  } else if (number >= 1024 && number < 1048576) {
    return `${(number / 1024).toFixed(1)} KB`;
  } else if (number >= 1048576) {
    return `${(number / 1048576).toFixed(1)} MB`;
  }
}

export const convertTimestamp = (timestamp: Timestamp, format: string) => {
  const newdate = new Date(
    timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000
  );
  let month = newdate.getMonth() + 1;
  let day = newdate.getDate();
  let year = newdate.getFullYear();
  const date1 = month + '/' + day + '/' + year;
  const date2 = new Date(timestamp.seconds * 1000).toLocaleString('uk-ua', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const time = new Date(timestamp.seconds * 1000).toLocaleString('uk-ua', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });

  switch (format) {
    case 'messageFormat':
      return `${date1} ${time}`;
    case 'userFormat':
      return date2;
    default:
      return date2;
  }
};
