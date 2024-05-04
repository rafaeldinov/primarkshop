'use client';

import { AppRouteEnum } from '@/app/const';
import { useState } from 'react';
import styles from './user-header.module.scss';
import { signOut, useSession } from 'next-auth/react';
import { useToggleModalStore } from '@/store/toggle-modal-store';
import { Skeleton } from '@mui/material';

export default function UserHeader() {
  const [isPendingSignout, setIsPendingSignout] = useState(false);

  const { data: session } = useSession();
  const emailVerified = session?.user.emailVerified;
  const email = session?.user.email;

  const setIsOpenEmailVerificationModal = useToggleModalStore(
    (state) => state.setIsOpenEmailVerificationModal
  );

  const handleSignoutClick = async () => {
    try {
      setIsPendingSignout(true);
      await signOut({ callbackUrl: AppRouteEnum.Root });
      window.location.reload();
    } catch {
      setIsPendingSignout(false);
    }
  };

  return (
    <div className={styles.user}>
      {isPendingSignout ? (
        <Skeleton variant='rounded' width={55} height={55} />
      ) : (
        <div className={styles.user__header}>
          {session && (
            <div className={styles.user__info}>
              <button
                className={styles.signout_button}
                onClick={handleSignoutClick}
                type='button'
              >
                Вийти
              </button>
              <span className={styles.user__email}>{email}</span>
            </div>
          )}
          {session && !emailVerified && (
            <div>
              <button
                onClick={() => setIsOpenEmailVerificationModal(true)}
                className={styles.verify_email_open_button}
                type='button'
              >
                підтвердити акаунт
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
