import { useEffect, useState } from "react";

import { FacturaFinder } from "../../../context/facturas/application/FacturaFinder";
import { FacturaSelected } from "../../../context/facturas/domain/events/FacturaSelected";
import { Factura } from "../../../context/facturas/domain/Factura";
import { useFacturasContext } from "../FacturasContext";

interface useFacturasReturn {
  factura: Factura | null;
  isLoading: boolean;
}

export const useFactura = (): useFacturasReturn => {
  const { facturaRepository, eventBus } = useFacturasContext();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [factura, setFactura] = useState<Factura | null>(null);

  const reloadFactura = async (event: FacturaSelected) => {
    setIsLoading(true);

    const finder = new FacturaFinder(facturaRepository);
    const response = await finder.run({ facturaId: event.facturaId });

    setFactura(response);
    setIsLoading(false);
  };

  useEffect(() => {
    const unsubscribe = eventBus.subscribe("facturaSelected", reloadFactura);

    return () => {
      unsubscribe();
    };
  }, []);

  return {
    factura,
    isLoading,
  };
};
