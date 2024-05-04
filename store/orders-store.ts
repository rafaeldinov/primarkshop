import { ApiCollectionEnum } from '@/app/const';
import {
  getAllOrders,
  getUserOrders,
  moveAllOpenOrdersToClosedCollection,
  moveOpenOrderToClosedCollection,
} from '@/firebase/order-actions';
import {
  deleteAllDocumentsInCollection,
  deleteCustomDocument,
} from '@/firebase/user-delete-documents';
import { OrderDocType } from '@/types/order-types';
import { create } from 'zustand';

interface OrdersStore {
  error: { text: string; type: string };
  loading: { isLoading: boolean; type: string };
  openUserOrders: OrderDocType[];
  closedUserOrders: OrderDocType[];
  openOrders: OrderDocType[];
  closedOrders: OrderDocType[];
  deleteAllClosedOrders: () => Promise<void>;
  deleteClosedOrder: (id: string, index: number) => Promise<void>;
  closeAllOrders: () => Promise<void>;
  closeOrder: (id: string) => Promise<void>;
  getOrders: (
    collectionName: string,
    user?: { user: boolean }
  ) => Promise<void>;
}

export const useOrdersStore = create<OrdersStore>((set, get) => ({
  error: { text: '', type: '' },
  loading: { isLoading: false, type: '' },
  openUserOrders: [],
  closedUserOrders: [],
  openOrders: [],
  closedOrders: [],
  deleteAllClosedOrders: async () => {
    set(() => ({
      loading: { isLoading: true, type: 'deleteAllClosedOrders' },
    }));
    const { error } = await deleteAllDocumentsInCollection(
      ApiCollectionEnum.ClosedOrders
    );
    set(() => ({
      loading: { isLoading: false, type: 'deleteAllClosedOrders' },
    }));

    if (error) {
      return set(() => ({
        error: { text: error, type: 'deleteAllClosedOrders' },
      }));
    }
    set(() => ({ closedOrders: [] }));
  },
  deleteClosedOrder: async (id: string, index: number) => {
    set(() => ({
      loading: { isLoading: true, type: 'deleteClosedOrders' },
    }));
    const { error } = await deleteCustomDocument(
      ApiCollectionEnum.ClosedOrders,
      id
    );
    set(() => ({
      loading: { isLoading: false, type: 'deleteClosedOrders' },
    }));

    if (error) {
      return set(() => ({
        error: { text: error, type: 'deleteClosedOrders' },
      }));
    }

    const closedOrders = get().closedOrders;
    closedOrders.splice(index, 1);

    set(() => ({ closedOrders }));
  },
  closeAllOrders: async () => {
    const openOrders = get().openOrders;

    set(() => ({
      loading: { isLoading: true, type: 'closeAllOrders' },
    }));
    const response = await moveAllOpenOrdersToClosedCollection(openOrders);
    set(() => ({
      loading: { isLoading: false, type: 'closeAllOrders' },
    }));

    if (response?.error) {
      return set(() => ({
        error: { text: response?.error, type: 'closeAllOrders' },
      }));
    }

    set(() => ({ openOrders: [] }));
  },
  closeOrder: async (id: string) => {
    set(() => ({
      loading: { isLoading: true, type: 'closeOrder' },
    }));
    const { error } = await moveOpenOrderToClosedCollection(id);
    set(() => ({
      loading: { isLoading: false, type: 'closeOrder' },
    }));

    if (error) {
      return set(() => ({ error: { text: error, type: 'closeOrder' } }));
    }

    const openOrders = get().openOrders;
    set(() => ({ openOrders }));
  },
  getOrders: async (collectionName: string, user) => {
    const loadingType = () => {
      if (collectionName === ApiCollectionEnum.ActiveOrders && user?.user) {
        return 'getUserOpenOrders';
      }
      if (collectionName === ApiCollectionEnum.ClosedOrders && user?.user) {
        return 'getUserClosedOrders';
      }
      if (collectionName === ApiCollectionEnum.ActiveOrders && !user?.user) {
        return 'getOpenOrders';
      }
      if (collectionName === ApiCollectionEnum.ClosedOrders && !user?.user) {
        return 'getClosedOrders';
      }
      return '';
    };

    set(() => ({
      loading: { isLoading: true, type: loadingType() },
    }));

    let error = '';
    let orders: OrderDocType[] | undefined = [];

    if (user?.user) {
      const response = await getUserOrders(collectionName);
      if (response?.error) {
        error = response.error;
      } else {
        orders = response?.data as OrderDocType[] | undefined;
        error = '';
      }
    } else {
      const response = await getAllOrders(collectionName);
      if (response?.error) {
        error = response.error;
      } else {
        orders = response?.data as OrderDocType[];
        error = '';
      }
    }

    set(() => ({
      loading: { isLoading: false, type: loadingType() },
    }));

    if (
      error &&
      collectionName === ApiCollectionEnum.ActiveOrders &&
      user?.user
    ) {
      return set(() => ({ error: { text: error, type: 'getUserOpenOrders' } }));
    }
    if (
      error &&
      collectionName === ApiCollectionEnum.ClosedOrders &&
      user?.user
    ) {
      return set(() => ({
        error: { text: error, type: 'getUserClosedOrders' },
      }));
    }
    if (
      error &&
      collectionName === ApiCollectionEnum.ActiveOrders &&
      !user?.user
    ) {
      return set(() => ({ error: { text: error, type: 'getOpenOrders' } }));
    }
    if (
      error &&
      collectionName === ApiCollectionEnum.ClosedOrders &&
      !user?.user
    ) {
      return set(() => ({ error: { text: error, type: 'getClosedOrders' } }));
    }

    if (collectionName === ApiCollectionEnum.ActiveOrders && user?.user) {
      if (orders?.length === 0) {
        set(() => ({
          error: { text: 'замовлення відсутні', type: 'getUserOpenOrders' },
        }));
      } else {
        set(() => ({
          error: { text: '', type: 'getUserOpenOrders' },
        }));
      }
      set(() => ({ openUserOrders: orders }));
    }
    if (collectionName === ApiCollectionEnum.ClosedOrders && user?.user) {
      if (orders?.length === 0) {
        set(() => ({
          error: { text: 'замовлення відсутні', type: 'getUserClosedOrders' },
        }));
      } else {
        set(() => ({
          error: { text: '', type: 'getUserOpenOrders' },
        }));
      }
      set(() => ({ closedUserOrders: orders }));
    }

    if (collectionName === ApiCollectionEnum.ActiveOrders && !user?.user) {
      if (orders?.length === 0) {
        set(() => ({
          error: { text: 'замовлення відсутні', type: 'getOpenOrders' },
        }));
      } else {
        set(() => ({
          error: { text: '', type: 'getUserOpenOrders' },
        }));
      }
      set(() => ({ openOrders: orders }));
    }
    if (collectionName === ApiCollectionEnum.ClosedOrders && !user?.user) {
      if (orders?.length === 0) {
        set(() => ({
          error: { text: 'замовлення відсутні', type: 'getClosedOrders' },
        }));
      } else {
        set(() => ({
          error: { text: '', type: 'getUserOpenOrders' },
        }));
      }
      set(() => ({ closedOrders: orders }));
    }
  },
}));
