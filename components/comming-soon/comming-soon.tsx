import styles from './comming-soon.module.scss';

export default function CommingSoon() {
  return (
    <div className={styles.main}>
      <p className={styles.main__text}>
        Відкриття вже незабаром. Приєднуйтеся до нашої
      </p>
      <p>
        <a href='https://invite.viber.com/?g2=AQAQphdxMC4LoE33vxoJVEa0yGQnTJAl9TAkKyRAQjXd9dITriMRCWxiCmgghMV%2F'>
          <span className={styles.main__text_link}> VIBER </span>
        </a>
      </p>
      <p className={styles.main__text}>спільноти.</p>
    </div>
  );
}
