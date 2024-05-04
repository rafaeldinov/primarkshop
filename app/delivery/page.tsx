import Header from '@/components/header/header';
import styles from './page.module.scss';

export default function Delivery() {
  return (
    <div className={styles.delivery}>
      <Header />
      <div className={styles.delivery__text}>
        <div>
          <p>
            <b>Після розміщення замовлення</b>
          </p>
          <p>
            <b>{`з вами зв'яжеться наш менеджер`}.</b>
          </p>
          <p>Передоплата 100 % на картку.</p>
          <p>Термін доставки 6-12 днів. </p>
          <p>
            У вартість товара входить:
            <span className={styles.delivery__text_cursive}>
              <br />
              - доставка товару з Іспанії в Україну,
              <br />
              - відсоток посередника,
              <br />
              - транзакція готівки,
              <br />
              - затрати на пакування посилки.
              <br />
            </span>
            Ви сплачуєте лише за пересилання по Україні.
          </p>
          <p>Відправка: НОВА ПОШТА або УКР ПОШТА</p>
        </div>
      </div>
    </div>
  );
}
