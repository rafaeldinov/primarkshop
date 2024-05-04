'use client';

import { useSession } from 'next-auth/react';
import styles from './page.module.scss';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AppRouteEnum } from '@/app/const';
import { verifyTokenEmail } from '@/firebase/email-actions';
import Loader from '@/components/loader/loader';

export default function VerifyEmail({ params }: { params: { token: string } }) {
  const { data: session, update } = useSession();
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const newSession = {
    ...session,
    user: {
      ...session?.user,
      emailVerified: true,
    },
  };

  useEffect(() => {
    const token = params.token;
    if (!token) {
      return setText('запит на веріфікацію відсутній');
    }
    if (session?.user.emailVerified) {
      return setText('ваш акаунт веріфіковано');
    }

    const verify = async () => {
      setIsLoading(true);
      const response = await verifyTokenEmail(token);
      setIsLoading(false);
      if (response?.error) {
        setText(response?.error);
      }

      if (response?.data) {
        setIsLoading(true);
        const session = await update(newSession);
        setIsLoading(false);
        if (session?.user.emailVerified) {
          setText(response?.data.message);
        }
      }
    };
    if (token && !session?.user.emailVerified) {
      verify();
    }
  }, []);

  return (
    <div className={styles.email_verification}>
      {isLoading ? (
        <Loader width={50} height={50} />
      ) : (
        <p className={styles.email_verification__response_text}>{text}</p>
      )}
      <Link href={AppRouteEnum.Root} className={styles.back_to_main}>
        на головну
      </Link>
    </div>
  );
}
