'use client';

import styles from './form-add-update-card.module.scss';
import {
  AgeCategoryEnum,
  CardEnum,
  CategoryEnum,
  GenderEnum,
  SizesEnum,
  UserRoleEnum,
} from '../../app/const';
import { FormEvent, SyntheticEvent, useState } from 'react';
import React from 'react';
import { CardSchemaType } from '@/schemas/card-schema';
import { useSession } from 'next-auth/react';
import { addCard } from '@/firebase/add-card';
import { useToggleModalStore } from '@/store/toggle-modal-store';
import Loader from '../loader/loader';
import Picture from '../picture/picture';
import { toast } from 'react-toastify';
import { CardType } from '@/types/card-type';
import { useImagesStore } from '@/store/images-store';
import { useCardsStore } from '@/store/cards-store';

interface Props {
  cards: CardType[];
}

export default function FormAddUpdateCard({ cards }: Props) {
  const { data: session, status } = useSession();

  const [clothingSizes, setClothingSizes] = useState(
    new Array(Object.values(SizesEnum).length).fill(false)
  );
  const [totalSizes, setTotalSizes] = useState('');
  const [isRequired, setIsRequired] = useState(true);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CardSchemaType>({
    id: '',
    price: '',
    description: '',
    weight: '',
    category: '',
    ageCategory: AgeCategoryEnum.None,
    gender: GenderEnum.None,
    sizes: '',
  });

  const file = useImagesStore((state) => state.file);
  const urlCardImage = useImagesStore((state) => state.urlCardImage);
  const setFile = useImagesStore((state) => state.setFile);
  const setUrlCardImage = useImagesStore((state) => state.setUrlCardImage);

  const setIsOpenAllImagesModal = useToggleModalStore(
    (state) => state.setIsOpenAllImagesModal
  );
  const setIsOpenAddImageModal = useToggleModalStore(
    (state) => state.setIsOpenAddImageModal
  );

  const getFormRemoveCardCards = useCardsStore(
    (state) => state.getFormRemoveCardCards
  );

  const clearForm = (idValue: string) => {
    setClothingSizes(new Array(Object.values(SizesEnum).length).fill(false));
    setTotalSizes('');
    setIsRequired(true);
    setIsUpdate(false);
    setUrlCardImage(undefined);
    setFile(undefined);

    setFormData({
      id: idValue,
      price: '',
      description: '',
      weight: '',
      category: '',
      ageCategory: AgeCategoryEnum.None,
      gender: GenderEnum.None,
      sizes: '',
    });
  };

  const handleFormDataSubmit = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    if (
      status === 'unauthenticated' ||
      session?.user.role === UserRoleEnum.User
    ) {
      return toast.error(`ви не авториизовані для цієї операції`);
    }
    if (
      !formData.id ||
      !formData.price ||
      !formData.weight ||
      !formData.category
    ) {
      setIsRequired(false);
      return toast.error(`заповніть обов'язкові поля`);
    }

    if (formData.gender === GenderEnum.None) {
      formData.gender = '';
    }
    if (formData.ageCategory === AgeCategoryEnum.None) {
      formData.ageCategory = '';
    }

    const currentData: CardSchemaType = {
      ...formData,
      sizes: totalSizes,
    };
    const formOnlyWithImage = new FormData();
    if (file) {
      formOnlyWithImage.append('file', file);
    }
    setIsLoading(true);
    const response = await addCard(currentData, formOnlyWithImage);
    setIsLoading(false);
    if (response?.error) {
      return toast.error(response?.error);
    }
    toast.success('картку успішно додано');
    clearForm('');
    setIsRequired(true);
    getFormRemoveCardCards();
  };

  const validateNumberField = (string: string) => {
    let newString = string.replace(/[^0-9.]/g, ''); // only numbers
    let pointsCount = 0;
    for (let i = 0; i <= newString.length; i++) {
      if (newString[0] === '0' && newString[1] && newString[1] !== '.') {
        const arr = newString.split(''); // Convert the string to an array of characters
        arr.splice(i, 1, ''); // Replace the character at index
        newString = arr.join(''); // Convert the array of characters back to a string
      }
      if (pointsCount > 0 && newString[i] === '.') {
        const arr = newString.split(''); // Convert the string to an array of characters
        arr.splice(i, 1, ''); // Replace the character at index
        newString = arr.join(''); // Convert the array of characters back to a string
      }
      if (newString[i] === '.') {
        pointsCount += 1;
      }
    }
    return newString;
  };

  const handleSizesChange = (position: number) => {
    const updatedClothingSizes = clothingSizes.map((item, index) =>
      index === position ? !item : item
    );
    setClothingSizes(updatedClothingSizes);

    const totalSizes = updatedClothingSizes.reduce((sum, current, index) => {
      if (current === true) {
        return sum + `${Object.values(SizesEnum)[index]},`;
      }
      return sum;
    }, '');
    // removing last comma and set all sizes
    setTotalSizes(totalSizes.slice(0, -1));
  };

  const checkExists = (value: string) => {
    const card = cards.find((item) => item.id === value);

    if (typeof card?.sizes === 'string') {
      const cardSizes = card?.sizes.split(',');
      const sizes = Object.values(SizesEnum).map((size) =>
        cardSizes?.some((item) => item === size)
      );
      if (card) {
        setUrlCardImage(card.url);
        setIsUpdate(true);
        setClothingSizes(sizes);
        setTotalSizes(card.sizes);
        setFormData({
          id: card.id,
          price: card.price.toString(),
          description: card.description || '',
          weight: card.weight.toString(),
          category: card.category,
          ageCategory: card.ageCategory as AgeCategoryEnum,
          gender: card.gender as GenderEnum,
          sizes: card.sizes,
          path: card.path,
        });
      }
    }
    if (!card) {
      clearForm(value);
    }
  };

  const handleIdChange = async (evt: SyntheticEvent<HTMLInputElement>) => {
    const cardId = evt.currentTarget.value.replace(/ /g, ''); // remove all whitespaces
    setFormData({
      ...formData,
      id: cardId,
    });
    checkExists(cardId);
  };

  return (
    <div className={styles.main}>
      <form
        onSubmit={handleFormDataSubmit}
        className={styles.form}
        autoComplete='off'
      >
        <div
          className={`${styles.input_wrapper} ${
            formData.id || isRequired ? '' : styles.required
          }`}
        >
          <input
            onChange={handleIdChange}
            className={styles.input}
            value={formData.id}
            type='text'
            name='id'
            placeholder={CardEnum.ItemId}
          />
        </div>
        <div
          className={`${styles.input_wrapper} ${
            formData.price || isRequired ? '' : styles.required
          }`}
        >
          <input
            onChange={(evt) => {
              setFormData({
                ...formData,
                price: validateNumberField(evt.currentTarget.value),
              });
            }}
            value={formData.price}
            type='text'
            name='price'
            className={styles.input}
            placeholder={CardEnum.Price}
          />
        </div>
        <div
          className={`${styles.input_wrapper} ${
            formData.weight || isRequired ? '' : styles.required
          }`}
        >
          <input
            onChange={(evt) =>
              setFormData({
                ...formData,
                weight: validateNumberField(evt.currentTarget.value),
              })
            }
            value={formData.weight}
            type='text'
            name='weight'
            className={styles.input}
            placeholder={CardEnum.Weight}
          />
        </div>
        <div
          className={`${styles.input_wrapper} ${
            formData.category || isRequired ? '' : styles.required
          }`}
        >
          <input
            onChange={(evt) =>
              setFormData({
                ...formData,
                category: evt.currentTarget.value.trim(),
              })
            }
            value={formData.category}
            type='text'
            name='category'
            className={styles.input}
            placeholder={CardEnum.Category}
            list='category'
          />
          <datalist id='category'>
            {Object.values(CategoryEnum).map((item, index) => {
              return <option key={item + index}>{item}</option>;
            })}
          </datalist>
        </div>
        <div className={styles.input_wrapper}>
          <input
            onChange={(evt) =>
              setFormData({
                ...formData,
                description: evt.currentTarget.value.replace(/\s{2,}/g, ' '), // remove multiple whitespaces
              })
            }
            value={formData.description}
            type='text'
            name='description'
            className={styles.input}
            placeholder={CardEnum.Description}
          />
        </div>

        {urlCardImage && (
          <div className={styles.form__card_image}>
            <Picture src={urlCardImage} alt='card image' />
          </div>
        )}

        <div className={styles.radio}>
          <fieldset className={styles.radio__wrapper}>
            <legend>{CardEnum.AgeCategory}</legend>
            {Object.values(AgeCategoryEnum).map((value) => {
              return (
                <label key={value} className={styles.radio__label}>
                  {value}
                  <input
                    onChange={(evt) => {
                      setFormData({
                        ...formData,
                        ageCategory: evt.currentTarget.value as AgeCategoryEnum,
                      });
                    }}
                    type='radio'
                    name='ageCategory'
                    value={value}
                    className={styles.radio__button}
                    placeholder={CardEnum.AgeCategory}
                    checked={formData.ageCategory === value}
                  />
                </label>
              );
            })}
          </fieldset>

          <fieldset className={styles.radio__wrapper}>
            <legend>{CardEnum.Gender}</legend>
            {Object.values(GenderEnum).map((value) => {
              return (
                <label key={value} className={styles.radio__label}>
                  {value}
                  <input
                    onChange={(evt) => {
                      setFormData({
                        ...formData,
                        gender: evt.currentTarget.value as GenderEnum,
                      });
                    }}
                    type='radio'
                    name='gender'
                    value={value}
                    className={styles.radio__button}
                    placeholder={CardEnum.Gender}
                    checked={formData.gender === value}
                  />
                </label>
              );
            })}
          </fieldset>

          <fieldset className={styles.radio__wrapper}>
            <legend>{CardEnum.Sizes}</legend>
            {Object.values(SizesEnum).map((value, index) => {
              return (
                <label key={value} className={styles.radio__label}>
                  {value}
                  <input
                    onChange={() => handleSizesChange(index)}
                    type='checkbox'
                    name='size'
                    value={value}
                    className={styles.radio__button}
                    placeholder={CardEnum.Sizes}
                    checked={clothingSizes[index]}
                  />
                </label>
              );
            })}
          </fieldset>
        </div>

        {isLoading ? (
          <Loader width={50} height={50} />
        ) : (
          <div className={styles.form__buttons}>
            <div className={styles.form__buttons_choose_image_submit}>
              <button
                onClick={() => setIsOpenAddImageModal(true)}
                className={styles.button}
                type='button'
              >
                вибрати зображення
              </button>
              <input
                className={styles.button}
                type='submit'
                value={isUpdate ? 'Оновити' : 'Відправити'}
                disabled={isLoading}
              />
            </div>

            <div className={styles.form__buttons_add_show_images}>
              <button
                onClick={() => setIsOpenAllImagesModal(true)}
                className={styles.button}
                type='button'
              >
                всі зображення
              </button>
              <input
                onClick={() => clearForm('')}
                className={styles.button}
                type='reset'
                value='Скинути'
              />
            </div>
          </div>
        )}
        {file && <p className={styles.image__name}>{file.name}</p>}
      </form>
    </div>
  );
}
