'use client';

import React, { useState } from 'react';
import styles from './form-remove-card.module.scss';
import { CardType } from '@/types/card-type';
import { useCardsStore } from '@/store/cards-store';
import { toast } from 'react-toastify';
import Loader from '../loader/loader';
import Picture from '../picture/picture';
import noImage from '../../public/images/no-image.svg';
import Pagination from '@mui/material/Pagination/Pagination';
import { deleteCustomDocument } from '@/firebase/user-delete-documents';
import { deleteImage } from '@/firebase/user-storage-actions';

export default function FormRemoveCard() {
  const [isLoading, setIsLoading] = useState(false);
  const [deletedItemIndex, setDeletedItemIndex] = useState<number | undefined>(
    undefined
  );

  const getFormRemoveCardCards = useCardsStore(
    (state) => state.getFormRemoveCardCards
  );
  const formRemoveCardCards = useCardsStore(
    (state) => state.formRemoveCardCards
  );
  const formRemoveCardCurrentPage = useCardsStore(
    (state) => state.formRemoveCardCurrentPage
  );
  const formRemoveCardPageCount = useCardsStore(
    (state) => state.formRemoveCardPageCount
  );
  const setFormRemoveCardCurrentPage = useCardsStore(
    (state) => state.setFormRemoveCardCurrentPage
  );

  const handleRemoveItemClick = async (item: CardType, index: number) => {
    setIsLoading(true);
    setDeletedItemIndex(index);
    const { error } = await deleteCustomDocument('cards', item.id);

    if (error) {
      setIsLoading(false);
      return toast.error(error);
    }
    if (item.path && item.path !== noImage.src) {
      const response = await deleteImage(item.path);

      if (response.error) {
        return toast.error(response.error);
      }
    }

    toast.success('картку успішно видалено');
    setIsLoading(false);
    getFormRemoveCardCards();
  };

  const handlePageChange = (evt: React.ChangeEvent<unknown>, value: number) => {
    setFormRemoveCardCurrentPage(value);
    getFormRemoveCardCards();
  };

  return (
    <div>
      <div className={styles.remove_card__pagination}>
        <Pagination
          onChange={handlePageChange}
          count={formRemoveCardPageCount}
          size='large'
          page={formRemoveCardCurrentPage}
          defaultPage={1}
          siblingCount={0}
        />
      </div>
      <fieldset className={styles.remove_card_form}>
        <ul className={styles.remove_card_form__items}>
          {formRemoveCardCards.map((item, index) => (
            <li key={item.id + index} className={styles.remove_card_form__item}>
              <div className={styles.remove_card_form__image}>
                <Picture src={item.url || ''} alt={'case preview'} />
              </div>
              <span>
                <b>Артикул: </b>
                {item.id}
              </span>
              <span>
                <b>Дата:</b>
                {item.createdAt.toLocaleDateString('ua-UA', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
              <span>
                <b>Ціна:</b> {item.price}
              </span>
              {item.description && (
                <span>
                  <b>Опис:</b> {item.description}
                </span>
              )}
              {isLoading && deletedItemIndex === index ? (
                <Loader width={50} height={50} />
              ) : (
                <span className={styles.remove_button}>
                  <button
                    className={styles.button}
                    onClick={() => handleRemoveItemClick(item, index)}
                  >
                    видалити
                  </button>
                </span>
              )}
            </li>
          ))}
        </ul>
      </fieldset>
    </div>
  );
}
