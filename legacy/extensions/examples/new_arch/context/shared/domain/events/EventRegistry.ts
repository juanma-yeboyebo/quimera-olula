import { FacturaSelected } from "../../../facturas/domain/events/FacturaSelected";
import { FacturasFilterChanged } from "../../../facturas/domain/events/FacturasFilterChanged";

export type EventRegistry = FacturasFilterChanged | FacturaSelected;
