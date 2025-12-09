import { DomainEvent } from "../../../shared/domain/events/DomainEvent";
import { FacturaFilter } from "../FacturaFilter";

export interface FacturasFilterChanged extends DomainEvent {
  type: "facturasFilterChanged";
  filter: FacturaFilter;
}
