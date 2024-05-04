'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.scss';
import Link from 'next/link';
import { AppRouteEnum } from '@/app/const';
import { verifyChangePasswordToken } from '@/firebase/email-actions';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

interface Props {
  params: { token: string };
}

export default function ChangePassword({ params }: Props) {
  const [text, setText] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVisiblePassword, setIsVisiblePassword] = useState(false);

  const router = useRouter();
  const token = params.token;

  useEffect(() => {
    if (!token) {
      router.push(AppRouteEnum.Root);
    }
  }, [token, router]);

  const handleResetPasswordClick = async () => {
    if (password.length < 6 || password.length > 50)
      return toast.error('пароль не менше 6 і не більше 50 символів');

    setIsLoading(true);
    const response = await verifyChangePasswordToken(token, password);
    setIsLoading(false);

    if (response?.error) {
      setText(response?.error);
    }
    if (response?.data) {
      setText(response?.data);
    }
  };

  return (
    <div className={styles.change_password}>
      <p className={styles.change_password__response_text}>{text}</p>
      <Link href={AppRouteEnum.Root} className={styles.back_to_main}>
        на головну
      </Link>

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
          className={styles.change_password__input}
          value={password}
          name='password'
          type={isVisiblePassword ? 'text' : 'password'}
          minLength={7}
          placeholder='новий пароль'
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
      <button
        onClick={handleResetPasswordClick}
        className={styles.change_password__button}
        type='button'
        disabled={isLoading}
      >
        змінити пароль
      </button>
    </div>
  );
}
