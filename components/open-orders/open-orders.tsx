'use client';

import { useEffect, useState } from 'react';
import styles from './open-orders.module.scss';
import { useOrdersStore } from '@/store/orders-store';
import { OrderDocType } from '@/types/order-types';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Picture from '../picture/picture';
import InputSlider from '../input-slider/input-slider';
import { ApiCollectionEnum } from '@/app/const';
import Loader from '../loader/loader';
import Box from '@mui/material/Box/Box';
import TextField from '@mui/material/TextField/TextField';

interface Props {
  isUser: boolean;
}

interface StateOpenOrders extends OrderDocType {
  isOpen: boolean;
}

const dateOptions: Intl.DateTimeFormatOptions = {
  weekday: 'short',
  year: 'numeric',
  month: 'short',
  day: 'numeric',
};

export default function OpenOrders({ isUser }: Props) {
  const [stateOrders, setStateOrders] = useState<StateOpenOrders[]>([]);
  const [search, setSearch] = useState('');
  const [stateError, setStateError] = useState('');
  const [isHideOrders, setIsHideOrders] = useState(false);

  const loading = useOrdersStore((state) => state.loading);
  const error = useOrdersStore((state) => state.error);
  const getOrders = useOrdersStore((state) => state.getOrders);
  const openOrders = useOrdersStore((state) => state.openOrders);
  const openUserOrders = useOrdersStore((state) => state.openUserOrders);

  useEffect(() => {
    if (
      (!isUser && error.type === 'getOpenOrders') ||
      (isUser && error.type === 'getUserOpenOrders')
    ) {
      setStateError(error.text);
    } else {
      setStateError('');
    }
    const modifiedOrders = (isUser ? openUserOrders : openOrders).map(
      (item) => ({
        isOpen: false,
        ...item,
      })
    );
    setStateOrders(modifiedOrders);
  }, [openOrders, error, isUser, openUserOrders]);

  const handleSetCurrentOrderClick = (index: number) => {
    const orders = [...stateOrders];
    const isOpen = orders[index].isOpen;
    if (isOpen) {
      orders[index].isOpen = false;
    } else {
      orders[index].isOpen = true;
    }
    setStateOrders(orders);
  };

  if (
    (!isUser && loading.isLoading && loading.type === 'getOpenOrders') ||
    (isUser && loading.isLoading && loading.type === 'getUserOpenOrders')
  ) {
    return <Loader width={50} height={50} />;
  }

  return (
    <div className={styles.open_orders}>
      <button
        onClick={
          !isUser
            ? () => getOrders(ApiCollectionEnum.ActiveOrders)
            : () => getOrders(ApiCollectionEnum.ActiveOrders, { user: true })
        }
        className={styles.open_orders__button}
        type='button'
        disabled={
          (!isUser && loading.isLoading && loading.type === 'getOpenOrders') ||
          (isUser && loading.isLoading && loading.type === 'getUserOpenOrders')
        }
      >
        активні замовлення
      </button>
      {stateOrders.length > 0 && (
        <button
          onClick={() => setIsHideOrders(!isHideOrders)}
          type='button'
          className={styles.open_orders__expand}
        >
          {isHideOrders ? 'розгорнути' : 'згорнути'}
          {isHideOrders ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </button>
      )}

      {!isUser && (
        <Box
          className={styles.open_orders__search}
          component='form'
          noValidate
          autoComplete='off'
        >
          <TextField
            onChange={(evt) => setSearch(evt.currentTarget.value)}
            id='standard-basic'
            label='фільтрація за номером телефону'
            variant='standard'
            InputLabelProps={{
              style: { wordBreak: 'break-word' },
              className: `${styles.open_orders__search_input}`,
            }}
          />
        </Box>
      )}

      {!isUser && stateOrders.length > 0 && (
        <div>
          {stateOrders.length > 0 && (
            <div className={styles.open_orders__item_slider}>
              <InputSlider
                stateOrders={stateOrders}
                isCloseAllOpenOrders={true}
                setStateOrders={setStateOrders}
              />
            </div>
          )}
        </div>
      )}

      {stateError && <p className={styles.open_orders__error}>{stateError}</p>}

      {!isHideOrders && (
        <div className={styles.open_orders__list}>
          {stateOrders
            .filter((item) => {
              return search === ''
                ? item
                : item.userInfo.phone
                    .replace(/ /g, '')
                    .includes(search.replace(/ /g, ''));
            })
            .map((item, index) => {
              return (
                <div key={item.id + index} className={styles.open_orders__item}>
                  <button
                    onClick={() => handleSetCurrentOrderClick(index)}
                    className={styles.open_orders__item_header}
                    type='button'
                  >
                    {item.createdAt &&
                      new Date(item.createdAt).toLocaleString('ua-UA', {
                        hour12: false,
                      })}
                    {!isUser && ` / ${item.userInfo.phone}`}

                    {item.isOpen ? <ExpandMoreIcon /> : <ExpandLessIcon />}
                  </button>

                  {item.isOpen && (
                    <div>
                      {!isUser && (
                        <div className={styles.open_orders__item_slider}>
                          <InputSlider
                            stateOrders={stateOrders}
                            setStateOrders={setStateOrders}
                            item={
                              isUser ? openUserOrders[index] : openOrders[index]
                            }
                            index={index}
                          />
                          <hr />
                        </div>
                      )}
                      <div className={styles.open_orders__item_user_info}>
                        <p>
                          <b>{`Ім'я`}: </b>
                          {item.userInfo.name}
                        </p>
                        <p>
                          <b>Пошта: </b>
                          {item.userInfo.email}
                        </p>
                        <p>
                          <b>Сума: </b>
                          {item.totalCost}
                        </p>
                        <p>
                          <b>Вага: </b>
                          {item.totalWeight}
                        </p>
                        <p>
                          <b>Адреса: </b>
                          {item.userInfo.shippingTo}
                        </p>
                      </div>
                      <h3 className={styles.closed_orders__item_goods_title}>
                        <b>ТОВАРИ:</b>
                      </h3>
                      <div>
                        {item.cartItems.map((item) => {
                          return (
                            <div
                              key={item.sku + 'openOrders'}
                              className={styles.open_orders__item_goods}
                            >
                              <div className={styles.open_orders__item_image}>
                                <Picture
                                  src={item.url || ''}
                                  alt='order item preview icon'
                                />
                              </div>

                              <p>
                                <b>Код: </b>
                                {item.sku}
                              </p>
                              <p>
                                <b>Ціна: </b>
                                {item.price}
                              </p>
                              <p>
                                <b>Вага: </b>
                                {item.weight}
                              </p>
                              <p>
                                <b>Розмір: </b>
                                {item.size}
                              </p>
                              <p>
                                <b>Стать: </b>
                                {item.gender}
                              </p>
                              <p>
                                <b>Категорія: </b>
                                {item.category}
                              </p>
                              <p>
                                <b>Коментарій: </b>
                                {item.comment}
                              </p>
                              <p>
                                <b>Опис: </b>
                                {item.description}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}
