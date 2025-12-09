import { Criteria } from "../../shared/domain/criteria/Criteria";
import { Filter } from "../../shared/domain/criteria/Filter";
import { Order } from "../../shared/domain/criteria/Order";
import { Factura } from "../domain/Factura";
import { FacturaFilter } from "../domain/FacturaFilter";
import { FacturaRepository } from "../domain/FacturaRepository";

export class FacturaSearcher {
  constructor(private readonly repository: FacturaRepository) {}

  async run({ filter }: { filter: FacturaFilter }): Promise<Factura[]> {
    const criteria = new Criteria({
      filters: Object.entries(filter).map(([field, value]) => new Filter(field, "like", value)),
      order: Order.desc("idfactura"),
    });

    const facturas = await this.repository.search(criteria);

    return facturas;
  }
}
