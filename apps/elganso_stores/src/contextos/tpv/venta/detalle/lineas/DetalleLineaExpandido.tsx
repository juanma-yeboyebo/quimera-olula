import {
  desgloseLineaVenta,
  fiscalidadLineaVenta,
} from "#/ventas/comun/componentes/linea_venta_texto.ts";
import "./DetalleLineaExpandido.scss";
import { LineaVentaTpv } from "../../diseño.ts";

// El barcode/talla/color no caben bien como columnas más en la tabla (ya
// tiene muchos datos), ni los muestra TarjetaLineaVenta (compartido, no
// los conoce): se reutiliza esta fila tanto en el desplegable de la tabla
// como en la vista de tarjetas (ver TarjetaLinea.tsx).
export const VarianteLinea = ({ linea }: { linea: LineaVentaTpv }) => (
  <div className="detalle-linea-row">
    <div className="detalle-linea-campo">
      <span className="detalle-linea-etiqueta">Talla</span>
      <span>{linea.talla || "—"}</span>
    </div>
    <div className="detalle-linea-campo">
      <span className="detalle-linea-etiqueta">Color</span>
      <span>{linea.color || "—"}</span>
    </div>
    <div className="detalle-linea-campo">
      <span className="detalle-linea-etiqueta">Código de barras</span>
      <span>{linea.barcode || "—"}</span>
    </div>
  </div>
);

export const DetalleLineaExpandido = ({
  linea,
  divisa,
}: {
  linea: LineaVentaTpv;
  divisa?: string;
}) => {
  const desglose = desgloseLineaVenta(linea, divisa);
  const fiscalidad = fiscalidadLineaVenta(linea, divisa);

  return (
    <div className="DetalleLineaExpandido">
      <VarianteLinea linea={linea} />
      <div className="detalle-linea-row">
        <div className="detalle-linea-campo">
          <span className="detalle-linea-etiqueta">Desglose</span>
          <span>{desglose}</span>
        </div>
        <div className="detalle-linea-campo">
          <span className="detalle-linea-etiqueta">Impuestos y comisión</span>
          <span>{fiscalidad || "—"}</span>
        </div>
      </div>
    </div>
  );
};
