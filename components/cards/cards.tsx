'use client';

import { CardType } from '@/types/card-type';
import styles from './cards.module.scss';
import CardItem from '../card/card';
import { useCardsStore } from '@/store/cards-store';
import { useEffect, useState } from 'react';
import Loader from '../loader/loader';

export default function Cards() {
  const [stateCards, setStateCards] = useState<CardType[] | undefined>();

  const stateFilters = useCardsStore((state) => state.stateFilters);
  const isLoading = useCardsStore((state) => state.isLoading);
  const mainPageCurrentPage = useCardsStore(
    (state) => state.mainPageCurrentPage
  );
  const getMainPageCards = useCardsStore((state) => state.getMainPageCards);
  const cardsPerPageCount = useCardsStore((state) => state.cardsPerPageCount);

  useEffect(() => {
    getMainPageCards().then((cards) => {
      setStateCards(cards);
    });
  }, [getMainPageCards, stateFilters, mainPageCurrentPage, cardsPerPageCount]);

  // transform card's field with sizes as string to sizes as array
  const cardsWithArrayOfSizes = stateCards?.map((item) => {
    if (typeof item.sizes === 'string') {
      const sizes = item.sizes.split(',').filter((item) => item !== '');
      return { ...item, sizes };
    }
    return item;
  });

  if (isLoading) {
    return <Loader width={50} height={50} />;
  }

  return (
    <div>
      {cardsWithArrayOfSizes && cardsWithArrayOfSizes.length > 0 && (
        <div className={styles.cards}>
          {cardsWithArrayOfSizes?.map((card: CardType, index) => (
            <CardItem key={card.id + index} card={card} />
          ))}
        </div>
      )}
    </div>
  );
}
