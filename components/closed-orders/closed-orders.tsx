'use client';

import { useOrdersStore } from '@/store/orders-store';
import styles from './closed-orders.module.scss';
import InputSlider from '../input-slider/input-slider';
import { useEffect, useState } from 'react';
import { OrderDocType } from '@/types/order-types';
import { ApiCollectionEnum } from '@/app/const';
import Loader from '../loader/loader';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Picture from '../picture/picture';
import Box from '@mui/material/Box/Box';
import TextField from '@mui/material/TextField/TextField';
import { moveClosedOrderToOpenCollection } from '@/firebase/order-actions';
import { toast } from 'react-toastify';

interface Props {
  isUser: boolean;
}

interface StateOpenOrders extends OrderDocType {
  isOpen: boolean;
}

export default function ClosedOrders({ isUser }: Props) {
  const [stateOrders, setStateOrders] = useState<StateOpenOrders[]>([]);
  const [search, setSearch] = useState('');
  const [stateError, setStateError] = useState('');
  const [isHideOrders, setIsHideOrders] = useState(false);

  const loading = useOrdersStore((state) => state.loading);
  const error = useOrdersStore((state) => state.error);
  const closedOrders = useOrdersStore((state) => state.closedOrders);
  const closedUserOrders = useOrdersStore((state) => state.closedUserOrders);
  const getOrders = useOrdersStore((state) => state.getOrders);

  useEffect(() => {
    if (
      (!isUser && error.type === 'getClosedOrders') ||
      (isUser && error.type === 'getUserClosedOrders')
    ) {
      setStateError(error.text);
    } else {
      setStateError('');
    }

    const modifiedOrders = (isUser ? closedUserOrders : closedOrders).map(
      (item) => ({
        isOpen: false,
        ...item,
      })
    );

    setStateOrders(modifiedOrders);
  }, [closedOrders, error, isUser, closedUserOrders]);

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

  const handleOpenOrderClick = async (id: string, index: number) => {
    const { error, data } = await moveClosedOrderToOpenCollection(id);

    if (error) {
      return toast.error(error);
    }
    if (data) {
      const copyStateOrders = [...stateOrders];
      copyStateOrders.splice(index, 1);
      setStateOrders(copyStateOrders);
    }
  };

  if (
    (!isUser && loading.isLoading && loading.type === 'getClosedOrders') ||
    (isUser && loading.isLoading && loading.type === 'getUserClosedOrders')
  ) {
    return <Loader width={50} height={50} />;
  }

  return (
    <div className={styles.closed_orders}>
      <button
        onClick={
          !isUser
            ? () => getOrders(ApiCollectionEnum.ClosedOrders)
            : () => getOrders(ApiCollectionEnum.ClosedOrders, { user: true })
        }
        className={styles.closed_orders__button}
        type='button'
        disabled={
          (!isUser &&
            loading.isLoading &&
            loading.type === 'getClosedOrders') ||
          (isUser &&
            loading.isLoading &&
            loading.type === 'getUserClosedOrders')
        }
      >
        виконані замовлення
      </button>
      {stateOrders.length > 0 && (
        <button
          onClick={() => setIsHideOrders(!isHideOrders)}
          type='button'
          className={styles.closed_orders__expand}
        >
          {isHideOrders ? 'розгорнути' : 'згорнути'}
          {isHideOrders ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </button>
      )}

      {!isUser && (
        <Box
          className={styles.closed_orders__search}
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
              className: styles.closed_orders__search_input,
            }}
          />
        </Box>
      )}

      {!isUser && (
        <div>
          {stateOrders.length > 0 && (
            <div className={styles.closed_orders__item_slider}>
              <InputSlider
                isClosedOrders={true}
                isDeleteAllClosedOrders={true}
                stateOrders={stateOrders}
                setStateOrders={setStateOrders}
              />
            </div>
          )}
        </div>
      )}

      {stateError && (
        <p className={styles.closed_orders__error}>{stateError}</p>
      )}

      {!isHideOrders && (
        <div className={styles.closed_orders__list}>
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
                <div
                  key={item.id + index}
                  className={styles.closed_orders__item}
                >
                  <button
                    onClick={() => handleSetCurrentOrderClick(index)}
                    className={styles.closed_orders__item_header}
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
                        <div className={styles.closed_orders__item_slider}>
                          <InputSlider
                            isClosedOrders={true}
                            stateOrders={stateOrders}
                            setStateOrders={setStateOrders}
                            item={
                              isUser
                                ? closedUserOrders[index]
                                : closedOrders[index]
                            }
                            index={index}
                          />
                          <hr />
                        </div>
                      )}
                      {!isUser && (
                        <button
                          onClick={() => handleOpenOrderClick(item.id, index)}
                          className={styles.closed_orders__reopen_order}
                          type='button'
                        >
                          відкрити замовлення
                        </button>
                      )}
                      <div className={styles.closed_orders__item_user_info}>
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
                              key={item.sku + 'closedOrders'}
                              className={styles.closed_orders__item_goods}
                            >
                              <div className={styles.closed_orders__item_image}>
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
