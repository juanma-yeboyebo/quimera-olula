import { FacturasDetail } from "./detail/FacturasDetail";
import styles from "./Facturas.module.css";
import { FacturasFilter } from "./filter/FacturasFilter";
import { FacturasMaster } from "./master/FacturasMaster";

export const Facturas = () => {
  return (
    <>
      <h1>Facturas</h1>
      <section className={styles.facturas__root}>
        <FacturasFilter />
        <FacturasMaster />
        <FacturasDetail />
      </section>
    </>
  );
};
