import { create } from 'zustand';

type ToggleModalStore = {
  isOpenCartModal: boolean;
  isOpenSigninModal: boolean;
  isOpenSignupModal: boolean;
  isOpenEmailVerificationModal: boolean;
  isOpenAllImagesModal: boolean;
  isOpenAddImageModal: boolean;
  setIsOpenCartModal: (isOpenCartModal: boolean) => void;
  setIsOpenSigninModal: (isOpenSigninModal: boolean) => void;
  setIsOpenSignupModal: (isOpenSignupModal: boolean) => void;
  setIsOpenEmailVerificationModal: (isOpenSignupModal: boolean) => void;
  setIsOpenAllImagesModal: (isOpenSignupModal: boolean) => void;
  setIsOpenAddImageModal: (isOpenAddImageModal: boolean) => void;
};

export const useToggleModalStore = create<ToggleModalStore>((set) => ({
  isOpenCartModal: false,
  isOpenSigninModal: false,
  isOpenSignupModal: false,
  isOpenEmailVerificationModal: false,
  isOpenAllImagesModal: false,
  isOpenAddImageModal: false,
  setIsOpenCartModal: (isOpenCartModal) => {
    set(() => ({ isOpenCartModal }));
  },
  setIsOpenSigninModal: (isOpenSigninModal) => {
    set(() => ({ isOpenSigninModal }));
  },
  setIsOpenSignupModal: (isOpenSignupModal) => {
    set(() => ({ isOpenSignupModal }));
  },
  setIsOpenEmailVerificationModal: (isOpenEmailVerificationModal) => {
    set(() => ({ isOpenEmailVerificationModal }));
  },
  setIsOpenAllImagesModal: (isOpenAllImagesModal) => {
    set(() => ({ isOpenAllImagesModal }));
  },
  setIsOpenAddImageModal: (isOpenAddImageModal) => {
    set(() => ({ isOpenAddImageModal }));
  },
}));
