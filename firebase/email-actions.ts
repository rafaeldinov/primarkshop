'use server';

import { ApiCollectionEnum, VERIFY_EMAIL_EXPIRED_TIME } from '@/app/const';
import {
  getDocumentByCondition,
  updateDocument,
} from './server-only/document-actions';
import ShortUniqueId from 'short-unique-id';
import { getServerSession } from 'next-auth';
import bcrypt from 'bcrypt';
import { authConfig } from '@/app/api/auth/[...nextauth]/route';
import EmailTemplate from '@/components/email-template/email-template';
import { Resend } from 'resend';
import { render } from '@react-email/render';
const nodemailer = require('nodemailer');

export type SendEmailResponse = {
  data: { id: string } | null;
  error: {
    statusCode: number;
    message: string;
    name: string;
  };
};

export async function sendChangePasswordEmail(email: string) {
  const emailResponse = await getDocumentByCondition(
    ApiCollectionEnum.Users,
    'email',
    '==',
    email
  );

  if (emailResponse.error) {
    return { error: 'користувач з такою поштою не знайдений', data: null };
  }

  const userId = emailResponse.data?.docs[0].id;
  const id = new ShortUniqueId();
  const tokenWithTimestamp = id.stamp(32);

  if (userId) {
    const updateUserResponse = await updateDocument(
      ApiCollectionEnum.Users,
      { changePasswordToken: tokenWithTimestamp },
      userId
    );

    if (updateUserResponse.error) {
      return { error: updateUserResponse.error, data: null };
    }
  }

  const transporter = nodemailer.createTransport({
    host: process.env.ZOHO_SMTP_HOST,
    port: process.env.ZOHO_SMTP_PORT,
    secure: true,
    auth: {
      user: process.env.ZOHO_SMTP_USER,
      pass: process.env.ZOHO_SMTP_PASSWORD,
    },
  });

  const info = {
    from: 'noreply@primarkshop.store',
    to: email,
    subject: `Зміна паролю на: ${process.env.API_URL}`,
    text: '',
    html: render(EmailTemplate(tokenWithTimestamp, 'change_password')),
  };
  try {
    const result = await transporter.sendMail(info);
    return { error: null, data: { messageId: result.messageId } };
  } catch (error) {
    console.log(error);
    return { error: 'помилка при відправлені листа', data: null };
  }
}

export async function sendVerifyEmail(email: string) {
  const session = await getServerSession(authConfig);
  if (!session) {
    return { error: 'немає активної сесії', data: null };
  }

  const emailResponse = await getDocumentByCondition(
    ApiCollectionEnum.Users,
    'email',
    '==',
    email
  );
  if (emailResponse.error) {
    return { error: 'користувач з такою поштою не знайдений', data: null };
  }
  const doc = emailResponse.data?.docs[0].data();
  if (doc?.emailVerified) {
    return { error: 'акаунт вже веріфіковано', data: null };
  }
  const userId = emailResponse.data?.docs[0].id;
  const id = new ShortUniqueId();
  const tokenWithTimestamp = id.stamp(32);

  if (userId) {
    const updateUserResponse = await updateDocument(
      ApiCollectionEnum.Users,
      { verifyEmailToken: tokenWithTimestamp },
      userId
    );

    if (updateUserResponse.error) {
      return { error: updateUserResponse.error, data: null };
    }
  }

  const transporter = nodemailer.createTransport({
    host: process.env.ZOHO_SMTP_HOST,
    port: process.env.ZOHO_SMTP_PORT,
    secure: true,
    auth: {
      user: process.env.ZOHO_SMTP_USER,
      pass: process.env.ZOHO_SMTP_PASSWORD,
    },
  });

  const info = {
    from: 'noreply@primarkshop.store',
    to: email,
    subject: `Зміна паролю на: ${process.env.API_URL}`,
    text: '',
    html: render(EmailTemplate(tokenWithTimestamp, 'verify_email')),
  };
  try {
    const result = await transporter.sendMail(info);
    return { error: null, data: { messageId: result.messageId } };
  } catch (error) {
    return { error: 'помилка при відправлені листа', data: null };
  }
}

export async function verifyChangePasswordToken(
  token: string,
  password: string
) {
  // find user with token
  const { error, data } = await getDocumentByCondition(
    ApiCollectionEnum.Users,
    'changePasswordToken',
    '==',
    token
  );
  // if token not found
  if (error || !data?.docs[0]) {
    return { error, data: null };
  }

  const doc = data.docs[0].data();
  const docId = data.docs[0].id;
  // decode a verify-email-token with an encoded timestamp
  const uid = new ShortUniqueId();
  const recoveredTimestamp = uid.parseStamp(doc.changePasswordToken);
  const expiredToken = recoveredTimestamp.getTime() + VERIFY_EMAIL_EXPIRED_TIME;
  const currentDate = Date.now();
  // check if the token has expired
  if (currentDate > expiredToken) {
    return {
      error: 'час підтвердження вичерпано, зробіть новий запит',
      data: null,
    };
  }
  const passwordHash = await bcrypt.hash(password, 10);

  const response = await updateDocument(
    ApiCollectionEnum.Users,
    {
      passwordHash,
    },
    docId
  );

  if (response.error) {
    return { error: response.error, data: null };
  }
  if (response.data?.updatedAt) {
    return { error: null, data: 'успішно оновлено' };
  }
}

export async function verifyTokenEmail(token: string) {
  // find user with token
  const { error, data } = await getDocumentByCondition(
    ApiCollectionEnum.Users,
    'verifyEmailToken',
    '==',
    token
  );
  // if token not found
  if (error || !data?.docs[0]) {
    return { error, data: null };
  }

  // if the account is already verified
  const doc = data.docs[0].data();

  if (doc.emailVerified) {
    return {
      error: null,
      data: { message: 'ваш акаунт вже веріфіковано' },
    };
  }
  // decode a verify-email-token with an encoded timestamp
  const uid = new ShortUniqueId();
  const recoveredTimestamp = uid.parseStamp(doc.verifyEmailToken);
  const expiredToken = recoveredTimestamp.getTime() + VERIFY_EMAIL_EXPIRED_TIME;
  const currentDate = Date.now();
  // check if the token has expired
  if (currentDate > expiredToken) {
    return {
      error: 'час підтвердження вичерпано, зробіть новий запит',
      data: null,
    };
  }
  // add the user's cart
  const { name, email, phone, shippingTo } = doc;
  const id = data.docs[0].id;

  const response = await updateDocument(
    ApiCollectionEnum.Carts,
    { user: { name, email, phone, shippingTo }, cartItems: [] },
    id
  );

  if (response.error) {
    return { error: 'помилка створення кошика', data: null };
  }
  // update user status to verified
  const result = await updateDocument(
    ApiCollectionEnum.Users,
    {
      emailVerified: true,
    },
    id
  );

  if (result.data) {
    return {
      error: null,
      data: { message: 'ви успішно веріфіцировали акаунт' },
    };
  }
  if (result.error) {
    return {
      error: result.error,
      data: null,
    };
  }
}
