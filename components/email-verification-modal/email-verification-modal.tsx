'use client';

import { useToggleModalStore } from '@/store/toggle-modal-store';
import Modal from '../modal/modal';
import EmailVerification from '../email-verification/email-verification';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

export default function EmailVerificationModal() {
  const { data: session } = useSession();
  const emailVerified = session?.user.emailVerified;
  const email = session?.user.email;

  const isOpenEmailVerificationModal = useToggleModalStore(
    (state) => state.isOpenEmailVerificationModal
  );
  const setIsOpenEmailVerificationModal = useToggleModalStore(
    (state) => state.setIsOpenEmailVerificationModal
  );

  useEffect(() => {
    if (session && emailVerified) {
      setIsOpenEmailVerificationModal(false);
    }
  }, [session, emailVerified, setIsOpenEmailVerificationModal]);

  if (!isOpenEmailVerificationModal) {
    return;
  }

  return (
    <Modal
      isOpenModal={isOpenEmailVerificationModal}
      setIsOpenModal={setIsOpenEmailVerificationModal}
    >
      <EmailVerification
        email={email}
        emailVerified={emailVerified}
        setIsOpenEmailVerificationModal={setIsOpenEmailVerificationModal}
      />
    </Modal>
  );
}
