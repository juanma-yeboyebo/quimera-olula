import styles from "./FacturasDetail.module.css";

const LineSkeleton = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "22px",
        backgroundColor: "#3cff64",
      }}
    ></div>
  );
};

export const FacturasDetailSkeleton = () => {
  return (
    <section>
      <h1>Factura</h1>
      <section className={styles.factura_detail__root}>
        <label htmlFor="idfactura">ID Factura</label>
        <LineSkeleton />
        <label htmlFor="codigo">Código</label>
        <LineSkeleton />
        <label htmlFor="cliente">Cliente</label>
        <LineSkeleton />
        <label htmlFor="total">Total</label>
        <LineSkeleton />
      </section>
    </section>
  );
};
