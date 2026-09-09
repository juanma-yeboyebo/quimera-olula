import { TarjetaLineaVenta } from "#/ventas/comun/componentes/TarjetaLineaVenta.tsx";
import { LineaVentaTpv as Linea } from "../../diseño.ts";
import { VarianteLinea } from "./DetalleLineaExpandido.tsx";

// TarjetaLineaVenta (compartido) no conoce talla/color/barcode, propios de
// El Ganso: se añaden debajo reutilizando la misma fila que ya usa la vista
// de tabla en su desplegable de detalle (sin el desglose/fiscalidad, que la
// propia tarjeta ya muestra por su cuenta).
export const TarjetaLinea = ({
  linea,
  cantidadEditable = false,
  onCambioCantidad,
  divisa,
}: {
  linea: Linea;
  cantidadEditable?: boolean;
  onCambioCantidad?: (linea: Linea, cantidad: number) => void;
  divisa?: string;
}) => (
  <>
    <TarjetaLineaVenta
      linea={linea}
      cantidadEditable={cantidadEditable}
      onCambioCantidad={onCambioCantidad}
      divisa={divisa}
    />
    <VarianteLinea linea={linea} />
  </>
);
