'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from './main-nav.module.scss';
import { usePathname } from 'next/navigation';
import { useToggleModalStore } from '@/store/toggle-modal-store';
import { NavLinks, NavLinksEnum, UserRoleEnum } from '@/app/const';
import { useSession } from 'next-auth/react';
import { useMediaQuery } from '@/user-hooks/use-media-query';
import UserHeader from '../user-header/user-header';
import Cart from '../cart/cart';

export default function MainNav() {
  const [isBurger, setIsBurger] = useState(false);
  const mediaQuery = useMediaQuery(1200);

  const isOpenSigninModal = useToggleModalStore(
    (state) => state.isOpenSigninModal
  );
  const setIsOpenSigninModal = useToggleModalStore(
    (state) => state.setIsOpenSigninModal
  );

  useEffect(() => {
    if (isBurger) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    if (isOpenSigninModal) {
      setIsBurger(false);
    }
    if (!mediaQuery) {
      setIsBurger(false);
    }
  }, [isBurger, mediaQuery, isOpenSigninModal]);

  const { data: session } = useSession();
  const emailVerified = session?.user.emailVerified;
  const role = session?.user.role;
  const currentPath = usePathname();

  const navLinks: ({ link: string; name: string } | null)[] = NavLinks.map(
    (item) => {
      if (item.name === NavLinksEnum.Admin) {
        return role === UserRoleEnum.Admin ||
          (role === UserRoleEnum.Editor && emailVerified)
          ? item
          : null;
      }
      if (item.name === NavLinksEnum.Profile) {
        return emailVerified ? item : null;
      }
      if (item.name === NavLinksEnum.Signin) {
        return !session ? item : null;
      }
      return item;
    }
  );

  const handleNavLinkClick = () => {
    if (isBurger) {
      setIsBurger(!isBurger);
    }
  };
  return (
    <>
      <nav
        style={
          isBurger
            ? { height: '100vh', overflowY: 'hidden', userSelect: 'none' }
            : {}
        }
        className={
          isBurger ? `${styles.burger__active} ${styles.nav}` : styles.nav
        }
      >
        <ul className={styles.nav__menu}>
          {navLinks.map((item) => {
            if (!item) {
              return;
            }
            return (
              <li
                key={item.name}
                onClick={
                  item.name === NavLinksEnum.Signin
                    ? () => setIsOpenSigninModal(true)
                    : handleNavLinkClick
                }
                className={
                  currentPath === item?.link
                    ? `${styles.nav__item} ${styles.active}`
                    : styles.nav__item
                }
              >
                {item.name === NavLinksEnum.Signin ? (
                  <span className={styles.nav__link}> {item.name}</span>
                ) : (
                  <Link className={styles.nav__link} href={item.link}>
                    {item.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
        <div className={styles.nav__user_header}>
          <UserHeader />
        </div>
      </nav>

      {session && (
        <div className={styles.user_header}>
          <UserHeader />
        </div>
      )}

      <div className={styles.cart_burger_wrapper}>
        <Cart />
        <div
          onClick={() => setIsBurger(!isBurger)}
          className={`${styles.burger} ${
            isBurger ? styles.burger__active : ''
          }`}
        >
          <span className={styles.burger__span}></span>
        </div>
      </div>
    </>
  );
}
