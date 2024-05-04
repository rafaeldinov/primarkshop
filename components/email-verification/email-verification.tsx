'use client';

import styles from './email-verification.module.scss';
import { useState } from 'react';
import Loader from '../loader/loader';
import React from 'react';
import { sendVerifyEmail } from '@/firebase/email-actions';
import { toast } from 'react-toastify';

type Props = {
  email: string | undefined;
  emailVerified: boolean | undefined;
  setIsOpenEmailVerificationModal: (isOpenModal: boolean) => void;
};

export default function EmailVerification({
  email,
  emailVerified,

  setIsOpenEmailVerificationModal,
}: Props) {
  const [text, setText] = useState(
    'Щоб робити покупки, потрібно веріфікувати вашу пошту'
  );
  const [isLoading, setIsLoading] = useState(false);

  const [isSendButtonDisabled, setIsSendButtonDisabled] = useState(false);

  const handleSendVerification = async () => {
    if (emailVerified || !email) {
      return;
    }
    setIsLoading(true);
    const { error, data } = await sendVerifyEmail(email);
    setIsLoading(false);
    if (error) {
      return toast.error(error);
    }
    if (data) {
      setIsSendButtonDisabled(true);
      return setText('лист успішно надіслано');
    }
  };

  return (
    <div>
      {text ? (
        <div className={styles.email__verification}>
          <p className={styles.email__verification_text}>{text}</p>

          {!isSendButtonDisabled ? (
            <button
              className={styles.button}
              onClick={handleSendVerification}
              type='button'
              disabled={isLoading}
            >
              надіслати листа
            </button>
          ) : (
            <button
              className={styles.button}
              onClick={() => setIsOpenEmailVerificationModal(false)}
              type='button'
            >
              закрити
            </button>
          )}
        </div>
      ) : (
        <Loader width={35} height={35} />
      )}
    </div>
  );
}
