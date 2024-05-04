import { getCart } from '@/firebase/cart-actions';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItemSchemaType } from '@/schemas/cart-item-schema';
import { CardType } from '@/types/card-type';
import getCards from '@/firebase/get-cards';

interface CartStore extends InitialState {
  clearError: () => void;
  setToCartStorage: (item: CartItemSchemaType) => void;
  removeFromCartStorage: (sku: string) => void;
  getCart: () => Promise<void>;
  reset: () => void;
}

interface InitialState {
  cartItems: CartItemSchemaType[];
  isStoreLoading: boolean;
  error: string;
}

const initialState: InitialState = {
  cartItems: [],
  isStoreLoading: false,
  error: '',
};

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      ...initialState,
      clearError: () => {
        set(() => ({
          error: '',
        }));
      },
      setToCartStorage: (item: CartItemSchemaType) => {
        set((state) => ({
          cartItems: [...state.cartItems, item],
        }));
      },
      removeFromCartStorage: (sku: string) => {
        set((state) => ({
          cartItems: state.cartItems.filter((element) => element.sku !== sku),
        }));
      },
      getCart: async () => {
        set(() => ({ isStoreLoading: true }));
        const { error, data } = await getCart();
        const cartItems: CartItemSchemaType[] = data?.doc.cartItems;

        const response = await getCards();
        const cards: CardType[] = response.cards;

        if (error) {
          set(() => ({ isStoreLoading: false }));
          return set(() => ({ error }));
        }

        if (cartItems.length === 0) {
          set(() => ({ isStoreLoading: false }));
          return set(() => ({ error: 'empty_cart' }));
        }

        if (cards.length > 0) {
          const cartProductsInStock = cartItems.filter((item) =>
            cards.some((card) => card.id === item.sku)
          );

          if (
            cartProductsInStock.length === 0 ||
            cartProductsInStock.length !== cartItems.length
          ) {
            set(() => ({
              error: 'деякі вибрані товари відсутні в продажу',
            }));
          }

          set(() => ({ isStoreLoading: false }));
          set(() => ({
            cartItems: cartProductsInStock,
          }));
        }
      },
      reset: () => {
        set(initialState);
      },
    }),
    {
      name: 'userCart',
      partialize: (state) => ({ cartItems: state.cartItems }),
    }
  )
);
