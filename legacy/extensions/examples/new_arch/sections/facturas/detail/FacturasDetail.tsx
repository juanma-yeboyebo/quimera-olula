import { FacturasLineas } from "../lineas/FacturasLineas";
import styles from "./FacturasDetail.module.css";
import { FacturasDetailSkeleton } from "./FacturasDetailSkeleton";
import { useFactura } from "./useFactura";

export const FacturasDetail = () => {
  const { factura, isLoading } = useFactura();

  if (isLoading) {
    return <FacturasDetailSkeleton />;
  }
  if (!factura) {
    return <span>Sin factura seleccionada</span>;
  }

  return (
    <section>
      <h1>Factura {factura.codigo}</h1>
      <section className={styles.factura_detail__root}>
        <label htmlFor="idfactura">ID Factura</label>
        <input id="idfactura" disabled value={factura.idfactura.value} />
        <label htmlFor="codigo">Código</label>
        <input id="codigo" disabled value={factura.codigo} />
        <label htmlFor="cliente">Cliente</label>
        <input id="cliente" disabled value={factura.cliente} />
        <label htmlFor="total">Total</label>
        <input id="total" disabled value={factura.total} />
      </section>
      <FacturasLineas lineas={factura.lineas} />
    </section>
  );
};
