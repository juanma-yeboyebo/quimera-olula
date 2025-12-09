import { useEffect, useState } from "react";

import { FacturaSearcher } from "../../../context/facturas/application/FacturaSearcher";
import { FacturasFilterChanged } from "../../../context/facturas/domain/events/FacturasFilterChanged";
import { Factura } from "../../../context/facturas/domain/Factura";
import { FacturaFilter } from "../../../context/facturas/domain/FacturaFilter";
import { useFacturasContext } from "../FacturasContext";

interface useFacturasReturn {
  facturas: Factura[];
  isLoading: boolean;
}

export const useFacturas = (): useFacturasReturn => {
  const { facturaRepository, eventBus } = useFacturasContext();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [facturas, setFacturas] = useState<Factura[]>([]);

  const reloadFacturas = async (event?: FacturasFilterChanged) => {
    setIsLoading(true);

    const filter = event?.filter ?? ({} as FacturaFilter);

    const searcher = new FacturaSearcher(facturaRepository);
    const response = await searcher.run({ filter });

    setFacturas(response);
    setIsLoading(false);
  };

  useEffect(() => {
    void reloadFacturas();

    const unsubscribe = eventBus.subscribe("facturasFilterChanged", reloadFacturas);

    return () => {
      unsubscribe();
    };
  }, []);

  return {
    facturas,
    isLoading,
  };
};
