import styles from "./FacturaSummary.module.css";

export const FacturaSummarySkeleton = () => {
  return (
    <li>
      <section className={styles.factura_summary__title}>20XX0A000XXX</section>

      <section className={styles.factura_summary__body}>
        <span>Cliente nº 000000</span>
        <span>Total: 0.00 €</span>
      </section>
    </li>
  );
};
