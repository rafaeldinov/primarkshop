'use client';

import { AppRouteEnum } from '@/app/const';
import Link from 'next/link';
import styles from './logo-header.module.scss';

export default function LogoHeader() {
  return (
    <span className={styles.logo_header}>
      <Link className={styles.logo_header__link} href={AppRouteEnum.Root}>
        PrimarkShop
      </Link>
    </span>
  );
}
