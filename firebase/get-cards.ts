'use server';

import { CARDS_PER_PAGE } from '@/app/const';
import getAllCards from './server-only/document-actions';

export default async function getCards(
  filters?: { gender: string[]; category: string[]; ageCategory: string[] },
  page = 1,
  cardsPerPageCount = CARDS_PER_PAGE
) {
  const { pageCount, cards } = await getAllCards(
    filters,
    page,
    cardsPerPageCount
  );

  return { pageCount, cards };
}
