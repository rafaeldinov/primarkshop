'use client';

import styles from './cart-modal.module.scss';
import { useToggleModalStore } from '@/store/toggle-modal-store';
import Modal from '../modal/modal';
import Picture from '../picture/picture';
import TrashIcon from '../icons/trash-icon';
import { addToCart, clearCart } from '@/firebase/cart-actions';
import { useCartStore } from '@/store/cart-store';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import UahIcon from '../icons/uah-icon';
import { useSession } from 'next-auth/react';
import Loader from '../loader/loader';
import { addOrder } from '@/firebase/order-actions';
import { OrderType } from '@/types/order-types';
import { sendMessageToBot } from '@/configs/telegram-bot/bot';

export default function CartModal() {
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [text, setText] = useState('');

  const { data: session } = useSession();
  const emailVerified = session?.user.emailVerified;

  const isOpenCartModal = useToggleModalStore((state) => state.isOpenCartModal);
  const setIsOpenCartModal = useToggleModalStore(
    (state) => state.setIsOpenCartModal
  );
  const setIsOpenSignupModal = useToggleModalStore(
    (state) => state.setIsOpenSignupModal
  );
  const setIsOpenSigninModal = useToggleModalStore(
    (state) => state.setIsOpenSigninModal
  );

  const error = useCartStore((state) => state.error);
  const cartItems = useCartStore((state) => state.cartItems);
  const isStoreLoading = useCartStore((state) => state.isStoreLoading);
  const reset = useCartStore((state) => state.reset);
  const getCart = useCartStore((state) => state.getCart);
  const clearError = useCartStore((state) => state.clearError);
  const removeFromCartStorage = useCartStore(
    (state) => state.removeFromCartStorage
  );

  useEffect(() => {
    if (!isOpenCartModal) {
      setText('');
    }
    setIsLoading(isStoreLoading);

    if (error) {
      if (error === 'empty_cart') {
        toast.error('кошик порожній');
        clearError();
      } else {
        toast.error(error);
        clearError();
      }
    }

    if (cartItems.length === 0) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [cartItems.length, error, clearError, isStoreLoading, isOpenCartModal]);

  const totalCost = cartItems.reduce((accum, current) => {
    if (current.price) {
      return accum + Number(current.price);
    }
    return 0;
  }, 0);

  const totalWeight = cartItems.reduce((accum, current) => {
    if (current.price) {
      return accum + Number(current.weight);
    }
    return 0;
  }, 0);

  const handleSaveCartClick = async () => {
    setIsLoading(true);
    const { error, data } = await addToCart(cartItems);
    setIsLoading(false);

    if (data) {
      setText('кошик успішно збережено');
    }
    if (error) {
      setText(error);
    }
  };

  const handleMakeOrderClick = async () => {
    if (!session) {
      return toast.error('ви не увійшли в систему');
    }
    const orderCost = Number(totalCost.toFixed(3));
    const orderWeight = Number(totalWeight.toFixed(3));
    const user = session?.user;

    const order: OrderType = {
      userId: user?.id || '',
      totalWeight: orderWeight,
      totalCost: orderCost,
      cartItems,
    };

    // put order to bd
    if (session?.user.id) {
      setIsLoading(true);
      const { error, data } = await addOrder(order);
      setIsLoading(false);

      if (data?.id) {
        setIsLoading(true);
        const response = await clearCart();
        setIsLoading(false);

        if (response.error) {
          return toast.error(response.error);
        }
      }
      if (error) {
        return toast.error(error);
      }
    } else {
      return toast.error('потрібна аутентифікація');
    }

    // send order to telegram
    const telegramFormatCartItems = cartItems.map((item) => {
      const { sku } = item;
      return `Артикул: ${sku}`;
    });
    setIsLoading(true);
    const response = await sendMessageToBot(
      `
І'мя: ${user?.name}
Моб: ${user?.phone}
Пошта: ${user?.email}
Загальна вага: ${orderWeight}
Загальна вартість: ${orderCost}
Товари:
${telegramFormatCartItems.join(',\n')}
`
    );
    setIsLoading(false);

    if (response?.error) {
      toast.error(response?.error);
    }

    setText('дякуємо за замовлення');
    reset();
  };

  if (!isOpenCartModal) {
    return;
  }

  return (
    <Modal isOpenModal={isOpenCartModal} setIsOpenModal={setIsOpenCartModal}>
      <div className={styles.cart}>
        {text ? (
          <p className={styles.cart__item_state_text}>{text}</p>
        ) : (
          <div>
            <h2 className={styles.cart__header}>Ваше замовлення:</h2>
            {isLoading ? (
              <Loader width={50} height={50} />
            ) : (
              <ul className={styles.cart__list}>
                {cartItems.map((item, index) => {
                  return (
                    <li
                      className={styles.cart__item}
                      key={index + (item.sku || '')}
                    >
                      <div className={styles.cart__item_image}>
                        <Picture
                          src={item.url || ''}
                          alt={'cart item preview'}
                        />
                      </div>
                      <span className={styles.cart__item_info}>
                        <b>Код товару:</b>
                        <span className={styles.cart__item_text}>
                          {item.sku}
                        </span>
                      </span>
                      <span className={styles.cart__item_info}>
                        <b>Ціна:</b>
                        <span className={styles.cart__item_text}>
                          {item.price}
                          <span className={styles.cart__item_price_icon}>
                            <UahIcon />
                          </span>
                        </span>
                      </span>
                      {item.size && (
                        <span className={styles.cart__item_info}>
                          <b>Розмір:</b>
                          <span className={styles.cart__item_text}>
                            {item.size}
                          </span>
                        </span>
                      )}

                      {item.description && (
                        <span className={styles.cart__item_info}>
                          <b>Опис:</b>
                          <span className={styles.cart__item_text}>
                            {item.description}
                          </span>
                        </span>
                      )}
                      <span
                        onClick={() => removeFromCartStorage(item.sku || '')}
                        className={styles.cart__item_delete}
                      >
                        <TrashIcon width={20} height={20} />
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}

            {!session && (
              <div>
                <p className={styles.cart__unregistered_text}>
                  Щоб робити покупки потрібно
                </p>

                <button
                  onClick={() => {
                    setIsOpenCartModal(false);
                    setIsOpenSignupModal(true);
                  }}
                  className={styles.cart__register_link}
                  type='button'
                >
                  зареєструватись
                </button>
                <span className={styles.cart__unregistered_text}> або </span>
                <button
                  onClick={() => {
                    setIsOpenCartModal(false);
                    setIsOpenSigninModal(true);
                  }}
                  className={styles.cart__register_link}
                  type='button'
                >
                  увійти
                </button>
              </div>
            )}

            {session && !emailVerified && (
              <div className={styles.cart__unregistered_text}>
                <p>Щоб робити покупки потрібно</p>
                <p>підтвердити акаунт</p>
              </div>
            )}

            {session && emailVerified && (
              <div className={styles.cart__container}>
                <div className={styles.cart__save_load_button_wrapper}>
                  <button
                    onClick={handleSaveCartClick}
                    className={styles.cart__save}
                    type='button'
                    disabled={isDisabled || isLoading || !emailVerified}
                  >
                    зберегти поточний кошик
                  </button>
                  <button
                    onClick={getCart}
                    className={styles.cart__load}
                    type='button'
                    disabled={isLoading || !emailVerified}
                  >
                    завантажити збереженний кошик
                  </button>
                </div>
                <div className={styles.cart__place_order}>
                  <span className={styles.cart__place_order_summ}>
                    {totalCost}
                    <span className={styles.cart__item_price_icon}>
                      <UahIcon />
                    </span>
                  </span>

                  <button
                    onClick={handleMakeOrderClick}
                    className={styles.cart__place_order_send}
                    type='button'
                    disabled={isDisabled || isLoading || !emailVerified}
                  >
                    зробити замовлення
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
