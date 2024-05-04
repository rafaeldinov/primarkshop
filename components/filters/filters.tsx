'use client';

import styles from './filters.module.scss';
import { SyntheticEvent, useEffect, useState } from 'react';
import { AgeCategoryEnum, CategoryEnum, GenderEnum } from '@/app/const';
import { useCardsStore } from '@/store/cards-store';

export default function Filters() {
  const [filters, setFilters] = useState<{
    gender: string[];
    category: string[];
    ageCategory: string[];
  }>({
    gender: [],
    category: [],
    ageCategory: [],
  });
  const setStateFilters = useCardsStore((state) => state.setStateFilters);

  useEffect(() => {
    setStateFilters(filters);
  }, [filters, setStateFilters]);

  const handleFilteringClick = (evt: SyntheticEvent<HTMLDivElement>) => {
    if (evt.target instanceof HTMLInputElement) {
      const value = evt.target.value;

      const isGenderValue = Object.values(GenderEnum).some(
        (item) => item === value
      );
      const isCategoryValue = Object.values(CategoryEnum).some(
        (item) => item === value
      );
      const isAgeCategoryValue = Object.values(AgeCategoryEnum).some(
        (item) => item === value
      );

      if (isCategoryValue) {
        if (evt.target.checked && !filters.category.includes(value)) {
          const currentFilters = [...filters.category, value];

          return setFilters({ ...filters, category: currentFilters });
        }
        if (!evt.target.checked && filters.category.includes(value)) {
          const currentFilters = filters.category.filter(
            (item) => item !== value
          );
          return setFilters({ ...filters, category: currentFilters });
        }
      }

      if (isGenderValue) {
        if (evt.target.checked && !filters.gender.includes(value)) {
          const currentFilters = [...filters.gender, value];

          return setFilters({ ...filters, gender: currentFilters });
        }
        if (!evt.target.checked && filters.gender.includes(value)) {
          const currentFilters = filters.gender.filter(
            (item) => item !== value
          );
          return setFilters({ ...filters, gender: currentFilters });
        }
      }

      if (isAgeCategoryValue) {
        if (evt.target.checked && !filters.ageCategory.includes(value)) {
          const currentFilters = [...filters.ageCategory, value];

          return setFilters({
            ...filters,
            ageCategory: currentFilters,
          });
        }
        if (!evt.target.checked && filters.ageCategory.includes(value)) {
          const currentFilters = filters.ageCategory.filter(
            (item) => item !== value
          );
          return setFilters({
            ...filters,
            ageCategory: currentFilters,
          });
        }
      }
    }
  };

  return (
    <div>
      <div onClick={handleFilteringClick} className={styles.filtering}>
        <div className={styles.filtering__group}>
          <div className={styles.filtering__group_item}>
            <input
              className={styles.filtering__group_checkbox}
              type='checkbox'
              id='man'
              name='gender'
              value='чоловіча'
            />
            <label className={styles.filtering__group_label} htmlFor='man'>
              чоловіки
            </label>
          </div>
          <div className={styles.filtering__group_item}>
            <input
              className={styles.filtering__group_checkbox}
              type='checkbox'
              id='woman'
              name='gender'
              value='жіноча'
            />
            <label className={styles.filtering__group_label} htmlFor='woman'>
              жінки
            </label>
          </div>
          <div className={styles.filtering__group_item}>
            <input
              className={styles.filtering__group_checkbox}
              type='checkbox'
              id='unisex'
              name='gender'
              value='унісекс'
            />
            <label className={styles.filtering__group_label} htmlFor='unisex'>
              унісекс
            </label>
          </div>
        </div>

        <div className={styles.filtering__group}>
          <div className={styles.filtering__group_item}>
            <input
              className={styles.filtering__group_checkbox}
              type='checkbox'
              id='adult'
              name='age'
              value='дорослі'
            />
            <label className={styles.filtering__group_label} htmlFor='adult'>
              дорослі
            </label>
          </div>
          <div className={styles.filtering__group_item}>
            <input
              className={styles.filtering__group_checkbox}
              type='checkbox'
              id='children'
              name='age'
              value='діти'
            />
            <label className={styles.filtering__group_label} htmlFor='children'>
              діти
            </label>
          </div>
        </div>

        <div className={styles.filtering__group}>
          <div className={styles.filtering__group_item}>
            <input
              className={styles.filtering__group_checkbox}
              type='checkbox'
              id='accessories'
              name='category'
              value='аксесуари'
            />
            <label
              className={styles.filtering__group_label}
              htmlFor='accessories'
            >
              аксесуари
            </label>
          </div>
          <div className={styles.filtering__group_item}>
            <input
              className={styles.filtering__group_checkbox}
              type='checkbox'
              id='clothes'
              name='category'
              value='одяг'
            />
            <label className={styles.filtering__group_label} htmlFor='clothes'>
              одяг
            </label>
          </div>
          <div className={styles.filtering__group_item}>
            <input
              className={styles.filtering__group_checkbox}
              type='checkbox'
              id='footwear'
              name='category'
              value='взуття'
            />
            <label className={styles.filtering__group_label} htmlFor='footwear'>
              взуття
            </label>
          </div>
          <div className={styles.filtering__group_item}>
            <input
              className={styles.filtering__group_checkbox}
              type='checkbox'
              id='other'
              name='category'
              value='інше'
            />
            <label className={styles.filtering__group_label} htmlFor='other'>
              інше
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
