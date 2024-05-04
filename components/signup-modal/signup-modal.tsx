'use client';

import { useToggleModalStore } from '@/store/toggle-modal-store';
import Modal from '../modal/modal';
import Signup from '../signup/signup';

export default function SignupModal() {
  const { isOpenSignupModal } = useToggleModalStore((state) => state);
  const { setIsOpenSigninModal } = useToggleModalStore((state) => state);
  const { setIsOpenSignupModal } = useToggleModalStore((state) => state);

  if (!isOpenSignupModal) {
    return;
  }

  return (
    <Modal
      isOpenModal={isOpenSignupModal}
      setIsOpenModal={setIsOpenSignupModal}
    >
      <Signup
        setIsOpenSigninModal={setIsOpenSigninModal}
        setIsOpenSignupModal={setIsOpenSignupModal}
      />
    </Modal>
  );
}
