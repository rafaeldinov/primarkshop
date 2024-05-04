'use client';

import styles from './add-image-modal.module.scss';
import { getFileSize, validFileType } from '@/util';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import Picture from '../picture/picture';
import Modal from '../modal/modal';
import { useImagesStore } from '@/store/images-store';
import { useToggleModalStore } from '@/store/toggle-modal-store';

export default function AddImageModal() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [info, setInfo] = useState('');
  const [preview, setPreview] = useState('');

  const file = useImagesStore((state) => state.file);
  const setFile = useImagesStore((state) => state.setFile);
  const setUrlCardImage = useImagesStore((state) => state.setUrlCardImage);

  const isOpenAddImageModal = useToggleModalStore(
    (state) => state.isOpenAddImageModal
  );
  const setIsOpenAddImageModal = useToggleModalStore(
    (state) => state.setIsOpenAddImageModal
  );

  useEffect(() => {
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  }, [file]);

  const handleClearFile = () => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    setPreview('');
    setFile(undefined);
    setInfo('');
    setUrlCardImage(undefined);
  };

  const handleFileChange = (evt: ChangeEvent<HTMLInputElement>) => {
    let isValidFile;
    let fileSizeName;
    let fileSize;

    if (evt.target.files) {
      isValidFile = validFileType(evt.target.files[0]);
      fileSizeName = getFileSize(evt.target.files[0].size);
      fileSize = evt.target.files[0].size;
    }
    if (fileSize && fileSize > 1000000) {
      return toast.error('файл занадто великий, виберіть файл менше 1 МБ');
    }
    if (evt.target.files && isValidFile && fileSizeName) {
      setPreview(URL.createObjectURL(evt.target.files[0]));
      setUrlCardImage(URL.createObjectURL(evt.target.files[0]));
      setInfo(fileSizeName);
      setFile(evt.target.files[0]);
      return setIsOpenAddImageModal(false);
    }
    handleClearFile();
    return toast.error('файл не валідний');
  };

  if (!isOpenAddImageModal) {
    return;
  }

  return (
    <Modal
      isOpenModal={isOpenAddImageModal}
      setIsOpenModal={setIsOpenAddImageModal}
    >
      <div className={styles.container}>
        <fieldset className={styles.file}>
          <legend className={styles.legend}>завантажити зображення</legend>
          <div className={styles.file__wrapper}>
            <label
              className={`${styles.button} ${styles.file__label}`}
              htmlFor='image_uploads'
            >
              {preview ? 'вибрати інший файл' : 'вибрати файл'}
            </label>
            <input
              className={styles.file__input}
              ref={inputRef}
              onChange={handleFileChange}
              type='file'
              id='image_uploads'
              name='image_uploads'
              accept='image/*'
            />
          </div>
          {preview && (
            <div className={styles.file__preview_image}>
              <Picture src={preview} alt='preview upload' />
            </div>
          )}

          {info ? (
            <p className={styles.file__preview}>{info}</p>
          ) : (
            <p className={styles.file__preview}>розмір файлу не більше 1МБ</p>
          )}

          <div className={styles.upload_clear}>
            <button
              onClick={handleClearFile}
              className={`${styles.button} ${styles.clear}`}
              type='button'
            >
              Очистити
            </button>
          </div>
        </fieldset>
      </div>
    </Modal>
  );
}
