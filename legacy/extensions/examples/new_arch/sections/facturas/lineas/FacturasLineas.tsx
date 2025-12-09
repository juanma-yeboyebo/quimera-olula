import { LineaFactura } from "../../../context/facturas/domain/LineaFactura";
import { FacturaLineaSummary } from "./FacturaLineaSummary";

interface FacturasLineasProps {
  lineas: LineaFactura[];
}

export const FacturasLineas = ({ lineas }: FacturasLineasProps) => {
  const lineasItems = lineas.map(linea => (
    <FacturaLineaSummary key={linea.idlinea.value} linea={linea} />
  ));

  return (
    <section>
      <h2>Líneas</h2>
      <ul>{lineasItems}</ul>
    </section>
  );
};
