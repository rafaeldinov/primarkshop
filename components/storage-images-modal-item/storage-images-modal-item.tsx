'use client';

import Picture from '../picture/picture';
import { UrlAndPath } from '@/types/url-path';
import { toast } from 'react-toastify';
import styles from './storage-images-modal-item.module.scss';
import { useImagesStore } from '@/store/images-store';
import { deleteImage } from '@/firebase/user-storage-actions';

export default function StorageImagesModalItem({ item }: { item: UrlAndPath }) {
  const getImagesWithUrlsAndPathes = useImagesStore(
    (state) => state.getImagesWithUrlsAndPathes
  );

  const handleDeleteImageClick = async (path: string) => {
    const { error, data } = await deleteImage(path);
    if (error) {
      return toast.success(error);
    }
    if (data) {
      getImagesWithUrlsAndPathes();
      toast.success(data);
    }
  };

  return (
    <div className={styles.storage_item}>
      <Picture src={item.url} alt='card image' />
      <button
        className={styles.button}
        onClick={() => handleDeleteImageClick(item.path)}
        type='button'
      >
        видалити
      </button>
    </div>
  );
}
