'use client';

import { useToggleModalStore } from '@/store/toggle-modal-store';
import Modal from '../modal/modal';
import Signin from '../signin/signin';

export default function SigninModal() {
  const { isOpenSigninModal } = useToggleModalStore((state) => state);
  const { setIsOpenSigninModal } = useToggleModalStore((state) => state);
  const { setIsOpenSignupModal } = useToggleModalStore((state) => state);

  if (!isOpenSigninModal) {
    return;
  }
  return (
    <Modal
      isOpenModal={isOpenSigninModal}
      setIsOpenModal={setIsOpenSigninModal}
    >
      <Signin
        setIsOpenSigninModal={setIsOpenSigninModal}
        setIsOpenSignupModal={setIsOpenSignupModal}
      />
    </Modal>
  );
}
