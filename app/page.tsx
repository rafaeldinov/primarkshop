import styles from './page.module.scss';
import Banner from '@/components/banner/banner';
import Filters from '@/components/filters/filters';
import UpButton from '@/components/up-button/up-button';
import Cards from '@/components/cards/cards';
import getCards from '@/firebase/get-cards';
import MainPagePagination from '@/components/main-page-pagination/main-page-pagination';
import Header from '@/components/header/header';
import CardsPerPage from '@/components/cards-per-page/cards-per-page';

export default async function HomePage() {
  return (
    <div className={styles.main_page}>
      <Header />
      <Banner />
      <Filters />
      <div className={styles.main_page__pagination}>
        <CardsPerPage />
        <MainPagePagination />
      </div>
      <div className={styles.main_page__cards}>
        <Cards />
      </div>
      <div className={styles.main_page__up_button}>
        <UpButton />
      </div>
    </div>
  );
}
