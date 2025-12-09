import { FacturaId } from "../../shared/domain/FacturaId";
import { FacturaNotFound } from "../domain/error/FacturaNotFound";
import { Factura } from "../domain/Factura";
import { FacturaRepository } from "../domain/FacturaRepository";

export class FacturaFinder {
  constructor(private readonly repository: FacturaRepository) {}

  async run({ facturaId }: { facturaId: FacturaId }): Promise<Factura> {
    const factura = await this.repository.find(facturaId);
    if (!factura) {
      throw new FacturaNotFound(facturaId);
    }

    return factura;
  }
}
