import { DomainEvent } from "../../../shared/domain/events/DomainEvent";
import { FacturaId } from "../../../shared/domain/FacturaId";

export interface FacturaSelected extends DomainEvent {
  type: "facturaSelected";
  facturaId: FacturaId;
}
