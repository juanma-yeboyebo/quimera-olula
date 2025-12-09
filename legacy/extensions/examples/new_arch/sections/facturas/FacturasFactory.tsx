import { PinebooFacturaRepository } from "../../context/facturas/infrastructure/PinebooFacturaRepository";
import { InMemoryEventBus } from "../../context/shared/infrastructure/InMemoryEventBus";
import { Facturas } from "./Facturas";
import { FacturasContext } from "./FacturasContext";

export const FacturasFactory = () => {
  return (
    <FacturasContext.Provider
      value={{
        facturaRepository: new PinebooFacturaRepository(),
        eventBus: InMemoryEventBus,
      }}
    >
      <Facturas />
    </FacturasContext.Provider>
  );
};
