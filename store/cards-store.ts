import { CARDS_PER_PAGE } from '@/app/const';
import getCards from '@/firebase/get-cards';
import { CardType } from '@/types/card-type';
import { create } from 'zustand';

interface CardsStore {
  isLoading: boolean;
  cardsPerPageCount: number;
  stateFilters: FiltersType;
  mainPageCards: CardType[];
  formRemoveCardCards: CardType[];
  formAddUpdateCardCards: CardType[];
  mainPageCount: number;
  formRemoveCardPageCount: number;
  mainPageCurrentPage: number;
  formRemoveCardCurrentPage: number;
  setCardsPerPageCount: (cardsPerPageCount: number) => void;
  setStateFilters: (filters: FiltersType) => void;
  setMainPageCount: (pageCount: number) => void;
  setFormRemoveCardPageCount: (pageCount: number) => void;
  getMainPageCards: () => Promise<CardType[]>;
  getFormRemoveCardCards: () => Promise<void>;
  getFormAddUpdateCardCards: () => Promise<void>;
  setMainPageCurrentPage: (currentPage: number) => void;
  setFormRemoveCardCurrentPage: (currentPage: number) => void;
}

export const useCardsStore = create<CardsStore>((set, get) => ({
  isLoading: false,
  cardsPerPageCount: CARDS_PER_PAGE,
  stateFilters: {
    gender: [],
    category: [],
    ageCategory: [],
  },
  mainPageCards: [],
  formRemoveCardCards: [],
  formAddUpdateCardCards: [],
  mainPageCount: 0,
  formRemoveCardPageCount: 0,
  mainPageCurrentPage: 1,
  formRemoveCardCurrentPage: 1,
  setCardsPerPageCount: (cardsPerPageCount) => {
    set(() => ({ cardsPerPageCount }));
  },
  setStateFilters: async (stateFilters: FiltersType) => {
    set(() => ({ stateFilters }));
  },
  setMainPageCount: (pageCount: number) => {
    set(() => ({ mainPageCount: pageCount }));
  },
  setFormRemoveCardPageCount: (pageCount: number) => {
    set(() => ({ formRemoveCardPageCount: pageCount }));
  },
  getFormRemoveCardCards: async () => {
    const currentPage = get().formRemoveCardCurrentPage;

    set(() => ({ isLoading: true }));
    const { pageCount, cards } = await getCards(
      undefined,
      currentPage,
      CARDS_PER_PAGE
    );
    set(() => ({ isLoading: false }));

    set(() => ({ formRemoveCardPageCount: pageCount }));
    set(() => ({ formRemoveCardCards: cards }));
  },
  getMainPageCards: async () => {
    const filters = get().stateFilters;
    const currentPage = get().mainPageCurrentPage;
    const cardsPerPageCount = get().cardsPerPageCount;
    set(() => ({ isLoading: true }));
    const { pageCount, cards } = await getCards(
      filters,
      currentPage,
      cardsPerPageCount
    );
    set(() => ({ isLoading: false }));
    set(() => ({ mainPageCount: pageCount }));
    return cards;
  },
  getFormAddUpdateCardCards: async () => {
    set(() => ({ isLoading: true }));
    const { cards } = await getCards();
    set(() => ({ isLoading: false }));

    set(() => ({ formAddUpdateCardCards: cards }));
  },
  setMainPageCurrentPage: async (currentPage) => {
    set(() => ({ mainPageCurrentPage: currentPage }));
  },
  setFormRemoveCardCurrentPage: (currentPage) => {
    set(() => ({ formRemoveCardCurrentPage: currentPage }));
  },
}));
