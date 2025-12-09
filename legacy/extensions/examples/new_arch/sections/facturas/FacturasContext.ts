import { createContext, useContext } from "react";

import { FacturaRepository } from "../../context/facturas/domain/FacturaRepository";
import { EventBus } from "../../context/shared/domain/EventBus";

export interface FacturasContextValue {
  facturaRepository: FacturaRepository;
  eventBus: EventBus;
}
export const FacturasContext = createContext<FacturasContextValue>({} as FacturasContextValue);

export const useFacturasContext = (): FacturasContextValue => useContext(FacturasContext);
