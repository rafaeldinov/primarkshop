import styles from './header.module.scss';
import React from 'react';
import MainNav from '../main-nav/main-nav';
import SigninModal from '../signin-modal/signin-modal';
import SignupModal from '../signup-modal/signup-modal';
import LogoHeader from '../logo-header/logo-header';
import EmailVerificationModal from '../email-verification-modal/email-verification-modal';
import CartModal from '../cart-modal/cart-modal';
import AddImageModal from '../add-image-modal/add-image-modal';
import StorageImagesModal from '../storage-images-modal/storage-images-modal';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default async function Header() {
  return (
    <div>
      <ToastContainer position='top-center' autoClose={3000} />
      <div className={styles.container}>
        <LogoHeader />
        <MainNav />
        <SignupModal />
        <SigninModal />
        <EmailVerificationModal />
        <CartModal />
        <AddImageModal />
        <StorageImagesModal />
      </div>
    </div>
  );
}
