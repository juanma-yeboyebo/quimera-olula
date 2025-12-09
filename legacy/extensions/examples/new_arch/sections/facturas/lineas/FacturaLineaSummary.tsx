import { LineaFactura } from "../../../context/facturas/domain/LineaFactura";
import styles from "./FacturaLineaSummary.module.css";

interface FacturaLineaSummaryProps {
  linea: LineaFactura;
}

export const FacturaLineaSummary = ({ linea }: FacturaLineaSummaryProps) => {
  return (
    <li>
      <section className={styles.factura_linea_summary__title}>{linea.descripcion}</section>
      <section className={styles.factura_linea_summary__body}>
        <span>Referencia: {linea.referencia}</span>
        <span>
          {linea.cantidad} x {linea.pvp}€ = {linea.total}€
        </span>
      </section>
    </li>
  );
};
