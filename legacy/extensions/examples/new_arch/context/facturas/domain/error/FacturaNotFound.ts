import { FacturaId } from "../../../shared/domain/FacturaId";

export class FacturaNotFound extends Error {
  constructor(facturaId: FacturaId) {
    super(`Factura <${facturaId.value}> no encontrada`);
  }
}
