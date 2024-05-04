'use client';

import { useState } from 'react';
import styles from './signin.module.scss';
import { signIn } from 'next-auth/react';
import { toast } from 'react-toastify';
import { useSearchParams } from 'next/navigation';
import Loader from '../loader/loader';
import { sendChangePasswordEmail } from '@/firebase/email-actions';

export default function Signin({
  setIsOpenSigninModal,
  setIsOpenSignupModal,
}: {
  setIsOpenSigninModal: (isOpenModal: boolean) => void;
  setIsOpenSignupModal: (isOpenModal: boolean) => void;
}) {
  const [email, setEmail] = useState('');
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [isVisiblePassword, setIsVisiblePassword] = useState(false);
  const [isOpenPasswordForget, setIsOpenPasswordForget] = useState(false);

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');

  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

  const handleSigninClick = async () => {
    if (!password || !email) {
      return toast.error('заповніть всі поля форми');
    }
    if (password.length < 6 || password.length > 50)
      return toast.error('пароль не менше 6 і не більше 50 символів');
    if (!emailRegex.test(email)) {
      return toast.error('напишіть пошту коректно');
    }

    setIsLoading(true);
    const login = await signIn('credentials', {
      email,
      password,
      redirect: false,
      callbackUrl: callbackUrl || '/',
    });
    setIsLoading(false);
    if (login?.ok) {
      setIsOpenSigninModal(false);
      return window.location.reload();
    }
    if (login?.error) {
      return toast.error(login?.error);
    } else {
      toast.error('Невірно вказана пошта або пароль');
    }
  };

  const handleOpenModalSignUp = () => {
    setIsOpenSigninModal(false);
    setIsOpenSignupModal(true);
  };

  const handleSendResetPasswordClick = async () => {
    if (!isOpenPasswordForget) {
      return;
    }
    if (!emailRegex.test(email)) {
      return toast.error('напишіть пошту коректно');
    }

    setIsLoading(true);
    const { error, data } = await sendChangePasswordEmail(email);
    setIsLoading(false);

    if (error) {
      return toast.error(error);
    }
    if (data) {
      setText('лист успішно надіслано, перевірте свою пошту');
    }
  };

  if (text) {
    return <p>{text}</p>;
  }

  if (isLoading && !text) {
    return <Loader width={50} height={50} />;
  }

  return (
    <div>
      <div className={styles.signin}>
        {!isOpenPasswordForget && (
          <h2 className={styles.signin__header}>Увійти</h2>
        )}

        <input
          onChange={(evt) =>
            setEmail(evt.currentTarget.value.replace(/ /g, ''))
          }
          className={styles.signin__input}
          type='email'
          placeholder='електронна пошта'
        />

        {!isOpenPasswordForget && (
          <div
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <input
              onChange={(evt) =>
                setPassword(evt.currentTarget.value.replace(/ /g, ''))
              }
              value={password}
              name='password'
              className={styles.signin__input}
              type={isVisiblePassword ? 'text' : 'password'}
              minLength={7}
              placeholder='пароль'
              required
            />
            <svg
              onClick={() => setIsVisiblePassword(!isVisiblePassword)}
              style={{ cursor: 'pointer' }}
              width='28'
              height='28'
              viewBox='0 0 20 20'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M3.25909 11.6021C3.94254 8.32689 6.79437 6 10 6C13.2057 6 16.0574 8.32688 16.7409 11.6021C16.7974 11.8725 17.0622 12.0459 17.3325 11.9895C17.6029 11.933 17.7763 11.6682 17.7199 11.3979C16.9425 7.67312 13.6934 5 10 5C6.3066 5 3.05742 7.67311 2.28017 11.3979C2.22377 11.6682 2.39718 11.933 2.6675 11.9895C2.93782 12.0459 3.20268 11.8725 3.25909 11.6021Z'
                fill='#212121'
              />
              <path
                d='M10 8C8.067 8 6.5 9.567 6.5 11.5C6.5 13.433 8.067 15 10 15C11.933 15 13.5 13.433 13.5 11.5C13.5 9.567 11.933 8 10 8ZM7.5 11.5C7.5 10.1193 8.61929 9 10 9C11.3807 9 12.5 10.1193 12.5 11.5C12.5 12.8807 11.3807 14 10 14C8.61929 14 7.5 12.8807 7.5 11.5Z'
                fill='#212121'
              />
            </svg>
          </div>
        )}

        <button
          onClick={
            isOpenPasswordForget
              ? handleSendResetPasswordClick
              : handleSigninClick
          }
          className={styles.signin__button}
          type='button'
        >
          {isOpenPasswordForget
            ? 'Надіслати посилання для скидання паролю'
            : 'Увійти'}
        </button>

        <p className={styles.signup_link}>
          <button
            onClick={handleOpenModalSignUp}
            className={styles.signup_link__button}
            type='button'
          >
            Реєстрація
          </button>
          {isOpenPasswordForget && (
            <button
              onClick={() => setIsOpenPasswordForget(false)}
              className={styles.signup_link__button}
              type='button'
            >
              Вхід
            </button>
          )}
          {!isOpenPasswordForget && (
            <button
              onClick={() => setIsOpenPasswordForget(true)}
              className={styles.signup_link__button}
              type='button'
            >
              Забули пароль?
            </button>
          )}
        </p>
      </div>
    </div>
  );
}
