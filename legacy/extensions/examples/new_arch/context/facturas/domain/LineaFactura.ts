import { LineaFacturaId } from "./LineaFacturaId";

export interface LineaFactura {
  idlinea: LineaFacturaId;
  referencia: string;
  descripcion: string;
  cantidad: number;
  pvp: number;
  total: number;
}
