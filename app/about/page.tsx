import Header from '@/components/header/header';
import styles from './page.module.scss';

export default function About() {
  return (
    <div className={styles.about}>
      <Header />
      <div className={styles.about__text}>
        <div>
          <p>Викуп товару ПН-ПТ</p>
          <p>
            <b>Магазини Іспанії:</b> PRIMARK, LEFTIES, H&M, PUMA, MERCADONA та
            інші.
          </p>
          <p>
            <b>Види товарів:</b> одяг, взуття, аксесуари, білизна, іграшки,{' '}
            <br />
            вітаміни, косметика, продукти харчування тощо.
          </p>
          <p>
            Наша <b>VIBER</b> спільнота, існує вже більше 3 років:
            <br />
            <a href='https://invite.viber.com/?g2=AQAQphdxMC4LoE33vxoJVEa0yGQnTJAl9TAkKyRAQjXd9dITriMRCWxiCmgghMV%2F'>
              Посилання на наш вайбер канал
            </a>
          </p>
          <p>Долучайтесь !</p>
        </div>
      </div>
    </div>
  );
}
