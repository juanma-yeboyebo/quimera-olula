import { Factura } from "../../domain/Factura";
import { FacturaIdMother } from "./FacturaIdMother";

export class FacturaMother {
  static default(factura: Partial<Factura> = {}): Factura {
    return {
      idfactura: FacturaIdMother.default(),
      codigo: "20230A000001",
      cliente: "123456",
      total: 127.8,
      lineas: [],
      ...factura,
    };
  }
}
