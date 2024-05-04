'use client';

import { ReactNode, SyntheticEvent, useRef } from 'react';
import { useLockBodyScroll } from '@uidotdev/usehooks';
import styles from './modal.module.scss';

export default function Modal({
  children,
  isOpenModal,
  setIsOpenModal,
}: {
  children: ReactNode;
  isOpenModal: boolean;
  setIsOpenModal: (isOpenModal: boolean) => void;
}) {
  useLockBodyScroll();
  const modalRef = useRef<HTMLDivElement | null>(null);

  const handleWrapperClick = (evt: SyntheticEvent<HTMLDivElement>) => {
    if (
      isOpenModal &&
      modalRef.current &&
      !modalRef.current.contains(evt.target as HTMLDivElement)
    ) {
      setIsOpenModal(false);
    }
  };

  return (
    <div onClick={handleWrapperClick} id='modal' className={styles.modal}>
      <div ref={modalRef} className={styles.modal__content}>
        {children}
        <span
          onClick={() => setIsOpenModal(false)}
          className={styles.modal__close}
        >
          &times;
        </span>
      </div>
    </div>
  );
}
