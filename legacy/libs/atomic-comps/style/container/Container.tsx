import styles from "./Container.module.css";

export const Container = ({ children }) => {
  return <main className={styles.container__root}>{children}</main>;
};
