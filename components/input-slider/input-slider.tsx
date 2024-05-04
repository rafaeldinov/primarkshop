'use client';

import styles from './input-slider.module.scss';
import { useOrdersStore } from '@/store/orders-store';
import { OrderDocType } from '@/types/order-types';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Slider from '@mui/material/Slider';
import { SetStateAction, useEffect, useState } from 'react';

interface StateOrders extends OrderDocType {
  isOpen: boolean;
}

type Props = {
  isClosedOrders?: boolean;
  isDeleteAllClosedOrders?: boolean;
  isCloseAllOpenOrders?: boolean;
  stateOrders?: StateOrders[];
  setStateOrders?: React.Dispatch<SetStateAction<StateOrders[]>>;
  item?: OrderDocType;
  index?: number;
};

export default function InputSlider({
  isClosedOrders,
  isDeleteAllClosedOrders,
  isCloseAllOpenOrders,
  stateOrders,
  setStateOrders,
  item,
  index,
}: Props) {
  const [value, setValue] = useState(0);
  const [stateError, setStateError] = useState('');

  const closeOrder = useOrdersStore((state) => state.closeOrder);
  const error = useOrdersStore((state) => state.error);
  const closeAllOrders = useOrdersStore((state) => state.closeAllOrders);
  const deleteClosedOrder = useOrdersStore((state) => state.deleteClosedOrder);
  const deleteAllClosedOrders = useOrdersStore(
    (state) => state.deleteAllClosedOrders
  );

  useEffect(() => {
    if (
      error.type === 'deleteAllClosedOrders' ||
      error.type === 'deleteClosedOrder' ||
      error.type === 'closeAllOrders' ||
      error.type === 'closeOrder'
    ) {
      setStateError(error.text);
    }

    if (isDeleteAllClosedOrders && value === 100) {
      deleteAllClosedOrders();
    }
    if (isCloseAllOpenOrders && setStateOrders && value === 100) {
      closeAllOrders();
      setStateOrders([]);
    }
    if (
      value === 100 &&
      item &&
      typeof index === 'number' &&
      stateOrders &&
      setStateOrders
    ) {
      if (isClosedOrders) {
        deleteClosedOrder(item.id, index);
      } else {
        closeOrder(item.id);
      }
      const copyStateOrders = [...stateOrders];
      copyStateOrders.splice(index, 1);
      setStateOrders(copyStateOrders);
    }
  }, [
    error,
    value,
    closeOrder,
    item,
    index,
    setStateOrders,
    stateOrders,
    closeAllOrders,
    isCloseAllOpenOrders,
    isClosedOrders,
    deleteClosedOrder,
    deleteAllClosedOrders,
    isDeleteAllClosedOrders,
  ]);

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setValue(newValue as number);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Grid className={styles.container} item xs>
        <Slider
          style={{ height: '20px' }}
          className={styles.slider}
          value={typeof value === 'number' ? value : 0}
          onChange={handleSliderChange}
          aria-labelledby='input-slider'
        />
        <p className={styles.slider__text}>
          {isCloseAllOpenOrders && <span>ЗАВЕРШИТИ ВСІ ЗАМОВЛЕННЯ </span>}
          {isDeleteAllClosedOrders && <span>ВИДАЛИТИ ВСІ ЗАМОВЛЕННЯ</span>}

          {isClosedOrders && !isDeleteAllClosedOrders && (
            <span>видалити замовлення</span>
          )}
          {!isCloseAllOpenOrders &&
            !isDeleteAllClosedOrders &&
            !isClosedOrders && <span>завершити замовлення</span>}
        </p>
      </Grid>
      {stateError && <p className={styles.slider__error}>{stateError}</p>}
    </Box>
  );
}
