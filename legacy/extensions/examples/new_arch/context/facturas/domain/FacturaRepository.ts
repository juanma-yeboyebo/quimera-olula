import { Criteria } from "../../shared/domain/criteria/Criteria";
import { FacturaId } from "../../shared/domain/FacturaId";
import { Factura } from "./Factura";

export interface FacturaRepository {
  find(idfactura: FacturaId): Promise<Factura | null>;
  search(criteria: Criteria): Promise<Factura[]>;
  save(factura: Factura): Promise<void>;
}
