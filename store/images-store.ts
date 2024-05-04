import { StorageFolderEnum } from '@/app/const';
import { getAllImagesUrlsAndPathes } from '@/firebase/user-storage-actions';
import { UrlAndPath } from '@/types/url-path';
import { create } from 'zustand';

interface ImagesStore {
  file: File | undefined;
  urlCardImage: string | undefined;
  isLoading: boolean;
  urlsAndPathes: UrlAndPath[];
  setFile: (file?: File) => void;
  setUrlCardImage: (urlCardImage?: string) => void;
  getImagesWithUrlsAndPathes: () => void;
}

export const useImagesStore = create<ImagesStore>((set) => ({
  file: undefined,
  urlCardImage: undefined,
  isLoading: false,
  urlsAndPathes: [],
  setFile: (file) => {
    set(() => ({ file }));
  },
  setUrlCardImage: (urlCardImage) => {
    set(() => ({ urlCardImage }));
  },
  getImagesWithUrlsAndPathes: async () => {
    set(() => ({ isLoading: true }));
    const urlsAndPathes = await getAllImagesUrlsAndPathes(
      StorageFolderEnum.CardImages
    );
    set(() => ({ isLoading: false }));

    if (urlsAndPathes) {
      set(() => ({ urlsAndPathes }));
    }
  },
}));
