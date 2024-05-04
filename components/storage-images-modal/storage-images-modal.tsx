'use client';

import styles from './storage-images-modal.module.scss';
import { useEffect } from 'react';
import StorageImagesModalItem from '../storage-images-modal-item/storage-images-modal-item';
import { useImagesStore } from '@/store/images-store';
import { useToggleModalStore } from '@/store/toggle-modal-store';
import Loader from '../loader/loader';
import Modal from '../modal/modal';

export default function StorageImagesModal() {
  const urlsAndPathes = useImagesStore((state) => state.urlsAndPathes);
  const getImagesWithUrlsAndPathes = useImagesStore(
    (state) => state.getImagesWithUrlsAndPathes
  );
  const isLoading = useImagesStore((state) => state.isLoading);

  const isOpenAllImagesModal = useToggleModalStore(
    (state) => state.isOpenAllImagesModal
  );
  const setIsOpenAllImagesModal = useToggleModalStore(
    (state) => state.setIsOpenAllImagesModal
  );

  useEffect(() => {
    getImagesWithUrlsAndPathes();
  }, [getImagesWithUrlsAndPathes]);

  if (!isOpenAllImagesModal) {
    return;
  }

  return (
    <Modal
      isOpenModal={isOpenAllImagesModal}
      setIsOpenModal={setIsOpenAllImagesModal}
    >
      <div className={styles.images}>
        {isLoading ? (
          <Loader width={50} height={50} />
        ) : (
          <div className={styles.image_list}>
            {urlsAndPathes.map((item) => (
              <StorageImagesModalItem key={item.url} item={item} />
            ))}
          </div>
        )}
        <button
          type='button'
          className={styles.close_button}
          onClick={() => setIsOpenAllImagesModal(false)}
        >
          закрити
        </button>
      </div>
    </Modal>
  );
}
