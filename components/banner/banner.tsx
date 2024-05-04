'use client';

import Primark from '../../public/images/brands/PrimarkLogo1.png';
import styles from './banner.module.scss';
import banner from '../../public/images/header/banner.png';
import Lefties from '../icons/lefties';
import Mercadona from '../icons/mercadona';
import HandM from '../icons/h-and-m';

export default function Banner() {
  return (
    <div className={styles.banner}>
      <div className={styles.banner__title}>
        <p className={styles.banner__text}>
          Щотижневі викупи <br />
          товарів з Іспанії
        </p>
        <ul className={styles.banner__brand}>
          <li className={styles.banner__brand_primark}>
            <img
              className={styles.banner__brand_primark_image}
              src={Primark.src}
              width={150}
              height={20}
              alt='Primark logo'
            />
          </li>
          <li className={styles.banner__brand_lefties}>
            <Lefties />
          </li>
          <li className={styles.banner__brand_mercadona}>
            <Mercadona />
          </li>
          <li className={styles.banner__brand_handm}>
            <HandM />
          </li>
        </ul>
      </div>
      <div className={styles.banner__image_wrapper}>
        <img
          src={banner.src}
          className={styles.banner__image}
          alt='викупи одягу із магазинів Іспанії'
          sizes='(max-width: 768px) 100vw'
          // width={400}
          // height={600}
        />
      </div>
    </div>
  );
}
