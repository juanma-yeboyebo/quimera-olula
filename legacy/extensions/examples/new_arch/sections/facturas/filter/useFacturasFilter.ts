import { FacturaFilter } from "../../../context/facturas/domain/FacturaFilter";
import { FormEvent } from "../../../context/shared/domain/events/FormEvent";
import { useFacturasContext } from "../FacturasContext";

interface useFacturasFilterReturn {
  onSubmit: (event: FormEvent<FacturaFilter>) => void;
}

export const useFacturasFilter = (): useFacturasFilterReturn => {
  const { eventBus } = useFacturasContext();

  const onSubmit = (event: FormEvent<FacturaFilter>) => {
    event.preventDefault();

    const formData = event.target.elements;

    eventBus.dispatch({
      type: "facturasFilterChanged",
      timestamp: new Date(),
      filter: {
        codigo: formData.codigo.value,
      },
    });
  };

  return {
    onSubmit,
  };
};
