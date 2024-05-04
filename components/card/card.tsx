'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from './card.module.scss';
import { CardType } from '@/types/card-type';
import { CartItemSchema, CartItemSchemaType } from '@/schemas/cart-item-schema';
import { toast } from 'react-toastify';
import { useCartStore } from '@/store/cart-store';
import UahIcon from '../icons/uah-icon';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FormControl from '@mui/material/FormControl/FormControl';
import InputLabel from '@mui/material/InputLabel/InputLabel';
import MenuItem from '@mui/material/MenuItem/MenuItem';
import { SelectChangeEvent } from '@mui/material/Select/SelectInput';
import Select from '@mui/material/Select/Select';
import AddToCartIcon from '../icons/add-to-cart-icon';
import RemoveFromCartIcon from '../icons/remove-from-cart-icon';
import noImage from '../../public/images/no-image.svg';

export default function CardItem({ card }: { card: CardType }) {
  const commentRef = useRef<HTMLTextAreaElement | null>(null);

  const [cardInCart, setIsCardInCart] = useState<
    CartItemSchemaType | undefined | null
  >();
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const [cartItem, setCartItem] = useState<CartItemSchemaType>({
    description: card.description,
    category: card.category,
    ageCategory: card.ageCategory,
    gender: card.gender,
    url: card.url,
    sku: card.id,
    size: '',
    comment: '',
    price: card.price,
    weight: card.weight,
  });

  const cartItems = useCartStore((state) => state.cartItems);
  const setToCartStorage = useCartStore((state) => state.setToCartStorage);
  const removeFromCartStorage = useCartStore(
    (state) => state.removeFromCartStorage
  );

  useEffect(() => {
    const cardInCart = cartItems.find((item) => item.sku === card.id);
    setIsCardInCart(cardInCart);
  }, [card.id, card.sizes, cartItems]);

  const handleSetSizeChange = (evt: SelectChangeEvent<string>) => {
    setCartItem({ ...cartItem, size: evt.target.value as string });
  };

  const handleAddItemToCartClick = async () => {
    setCartItem({ ...cartItem, comment: commentRef.current?.value || '' });
    const userData = { ...cartItem, comment: commentRef.current?.value || '' };

    const result = CartItemSchema.safeParse(userData);
    if (result.success) {
      setToCartStorage(userData);
    }
    if (result.success === false) {
      return toast.error(result.error.issues[0].message);
    }
  };

  return (
    <section className={styles.card}>
      <div className={styles.card__image}>
        <img
          src={card.url || noImage.src}
          className={styles.card__image_image}
          alt='card image'
          width={200 || noImage.width}
          height={500 || noImage.height}
        />
      </div>

      {card.description && (
        <div className={styles.card__description}>
          <p
            onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
            className={styles.card__description_header}
          >
            <span className={styles.card__description_header_text}>
              про товар
            </span>

            {isDescriptionOpen ? <ExpandMoreIcon /> : <ExpandLessIcon />}
          </p>
          {isDescriptionOpen && (
            <p className={styles.card__description_text}>{card.description}</p>
          )}
        </div>
      )}

      <span className={styles.card__price}>
        {card.price}
        <span className={styles.card__price_icon}>
          <UahIcon />
        </span>
      </span>

      <div className={styles.card__sizes}>
        <FormControl
          style={{ minWidth: '100%' }}
          className={styles.card__sizes_item}
          variant='standard'
          fullWidth
          size='small'
        >
          <InputLabel style={{ padding: '0 5px' }} id='test-select-label'>
            <span
              className={
                card.sizes?.length === 0
                  ? styles.card__sizes_label_not_active
                  : styles.card__sizes_label
              }
            >
              {card.sizes?.length === 0 ? 'розміри не вказані' : 'розміри'}
            </span>
          </InputLabel>
          <Select
            className={styles.card__sizes_select}
            labelId='demo-select-small-label'
            id='demo-select-small'
            label='Розміри'
            value={cartItem.size}
            MenuProps={{
              disableScrollLock: true,
            }}
            onChange={handleSetSizeChange}
            disabled={card.sizes?.length === 0 || cardInCart ? true : false}
          >
            <MenuItem value=''>
              <span className={styles.card__sizes_item_label}>не вибрано</span>
            </MenuItem>
            {Array.isArray(card.sizes) &&
              card.sizes.map((item: string, index: number) => {
                return (
                  <MenuItem
                    key={index}
                    value={item}
                    className={styles.card__sizes_item_label}
                  >
                    <span className={styles.card__sizes_item_label}>
                      {item}
                    </span>
                  </MenuItem>
                );
              })}
          </Select>
        </FormControl>
      </div>

      <textarea
        ref={commentRef}
        className={styles.card__comment}
        name='comment'
        placeholder='Залиште свій коментар'
        disabled={cardInCart ? true : false}
      />

      <button
        onClick={
          cardInCart
            ? () => removeFromCartStorage(card.id)
            : handleAddItemToCartClick
        }
        className={cardInCart ? styles.in_cart : styles.add__to_cart}
        type='button'
      >
        {cardInCart ? (
          <span className={styles.button__cart_icon}>
            <RemoveFromCartIcon />
          </span>
        ) : (
          <span className={styles.button__cart_icon}>
            <AddToCartIcon />
          </span>
        )}
        <span className={styles.button__cart_icon_text}>
          {cardInCart ? 'видалити з кошика' : 'додати до кошика'}
        </span>
      </button>
    </section>
  );
}
