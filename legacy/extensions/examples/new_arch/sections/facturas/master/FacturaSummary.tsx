import { Factura } from "../../../context/facturas/domain/Factura";
import { useFacturasContext } from "../FacturasContext";
import styles from "./FacturaSummary.module.css";

interface FacturaSummaryProps {
  factura: Factura;
}

export const FacturaSummary = ({ factura }: FacturaSummaryProps) => {
  const { eventBus } = useFacturasContext();

  const handleClick = () => {
    eventBus.dispatch({
      type: "facturaSelected",
      timestamp: new Date(),
      facturaId: factura.idfactura,
    });
  };

  return (
    <li onClick={handleClick}>
      <section className={styles.factura_summary__title}>{factura.codigo}</section>
      <section className={styles.factura_summary__body}>
        <span>Cliente nº {factura.cliente}</span>
        <span>Total: {factura.total} €</span>
      </section>
    </li>
  );
};
