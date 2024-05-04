'use client';

import { useToggleModalStore } from '@/store/toggle-modal-store';
import CartIcon from '../icons/cart-icon';
import styles from './cart.module.scss';
import { useCartStore } from '@/store/cart-store';

export default function Cart() {
  const cartItems = useCartStore((state) => state.cartItems);

  const setIsOpenCartModal = useToggleModalStore(
    (state) => state.setIsOpenCartModal
  );

  return (
    <div onClick={() => setIsOpenCartModal(true)} className={styles.cart}>
      <span className={styles.cart__item}>
        <CartIcon />
      </span>
      {cartItems.length > 0 && (
        <span className={styles.cart__items_count}>{cartItems.length}</span>
      )}
    </div>
  );
}
