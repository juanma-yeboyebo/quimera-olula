import { FacturaSummary } from "./FacturaSummary";
import { FacturaSummarySkeleton } from "./FacturaSummarySkeleton";
import { useFacturas } from "./useFacturas";

export const FacturasMaster = () => {
  const { facturas, isLoading } = useFacturas();

  const facturaList = isLoading
    ? new Array(11).fill(null).map((_, idx) => <FacturaSummarySkeleton key={idx} />)
    : facturas.map(factura => <FacturaSummary key={factura.idfactura.value} factura={factura} />);

  return <ul>{facturaList}</ul>;
};
