import { FacturaId } from "../../shared/domain/FacturaId";
import { FacturaRepository } from "../domain/FacturaRepository";
import { LineaFactura } from "../domain/LineaFactura";

export class LineaFacturaAdder {
  constructor(private readonly repository: FacturaRepository) {}

  async run(facturaId: FacturaId, linea: LineaFactura): Promise<void> {
    if (!linea.idlinea) {
      throw new Error("Debe informar una línea");
    }

    await this.repository.addLinea(facturaId, linea);
  }
}
