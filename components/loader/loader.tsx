import styles from './loader.module.scss';

export default function Loader({
  width,
  height,
}: {
  width: number;
  height: number;
}) {
  return (
    <span
      style={{ width: width, height: height }}
      className={styles.loader}
    ></span>
  );
}
