import { changeRole, deleteUser, getAllUsers } from '@/firebase/admin-actions';
import { UserStoreType } from '@/types/user-types';
import { create } from 'zustand';

type UsersStore = {
  isLoading: boolean;
  error: string;
  users: UserStoreType[];
  getUsers: () => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  changeRole: (userRole: string, id: string) => Promise<void | Date>;
};

export const useUsersStore = create<UsersStore>((set) => ({
  isLoading: false,
  error: '',
  users: [],
  getUsers: async () => {
    set(() => ({ isLoading: true }));
    const response = await getAllUsers();
    set(() => ({ isLoading: false }));

    if (response?.error) {
      return set(() => ({ error: response.error }));
    } else {
      set(() => ({ error: '' }));
    }

    if (response?.data?.docs) {
      const users = response?.data?.docs;

      if (users.length === 0) {
        return set(() => ({ error: 'користувачі відсутні' }));
      } else {
        set(() => ({ error: '' }));
      }

      set(() => ({ users }));
    }
  },
  deleteUser: async (id: string) => {
    set(() => ({ isLoading: true }));
    const response = await deleteUser(id);
    set(() => ({ isLoading: false }));
  },
  changeRole: async (userRole: string, id: string) => {
    set(() => ({ isLoading: true }));
    const { error, data } = await changeRole(userRole, id);
    set(() => ({ isLoading: false }));

    if (error) {
      return set(() => ({ error }));
    } else {
      set(() => ({ error: '' }));
    }

    return data?.updatedAt;
  },
}));
