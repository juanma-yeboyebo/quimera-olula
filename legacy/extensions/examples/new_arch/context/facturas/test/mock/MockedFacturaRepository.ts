import { Criteria } from "../../../shared/domain/criteria/Criteria";
import { FacturaId } from "../../../shared/domain/FacturaId";
import { Factura } from "../../domain/Factura";
import { FacturaRepository } from "../../domain/FacturaRepository";

export class MockedFacturaRepository implements FacturaRepository {
  private readonly mockFind = jest.fn();
  private readonly mockSearch = jest.fn();
  private findReturn: Factura | null = null;
  private searchReturn: Factura[] = [];

  async find(idfactura: FacturaId): Promise<Factura | null> {
    this.mockFind(idfactura);

    return Promise.resolve(this.findReturn);
  }

  async search(criteria: Criteria): Promise<Factura[]> {
    this.mockSearch(criteria);

    return Promise.resolve(this.searchReturn);
  }

  async save(_factura: Factura): Promise<void> {
    await Promise.resolve();
  }

  returnOnFind(factura: Factura): void {
    this.findReturn = factura;
  }

  returnOnSearch(facturas: Factura[]): void {
    this.searchReturn = facturas;
  }

  assertFind(): void {
    expect(this.mockFind).toHaveBeenCalled();
  }

  assertSearch(): void {
    expect(this.mockSearch).toHaveBeenCalled();
  }
}
