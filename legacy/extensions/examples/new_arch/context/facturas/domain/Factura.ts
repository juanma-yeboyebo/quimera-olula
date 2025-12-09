import { FacturaId } from "../../shared/domain/FacturaId";
import { LineaFactura } from "./LineaFactura";

export interface Factura {
  idfactura: FacturaId;
  codigo: string;
  cliente: string;
  total: number;
  lineas: LineaFactura[];
}
