import { QBoton } from "@olula/componentes/index.js";
import { EmitirEvento } from "@olula/lib/diseño.js";
import { formatearMoneda } from "@olula/lib/dominio.ts";
import { VentaTpv } from "../../diseño.ts";
import "./PendienteVenta.css";

interface PendienteVentaProps {
  venta: VentaTpv;
  publicar: EmitirEvento;
}

export const PendienteVenta = ({ venta, publicar }: PendienteVentaProps) => {
  const divisa = venta.divisa_id || "EUR";

  return (
    <div className="PendienteVenta">
      <div className="botones maestro-botones ">
        <QBoton onClick={() => publicar("pago_efectivo_solicitado")}>
          P. Efectivo
        </QBoton>

        <QBoton onClick={() => publicar("pago_tarjeta_solicitado")}>
          P. Tarjeta
        </QBoton>
      </div>

      <div className="PendienteVenta-item">
        <label>Total:</label>
        <span>{formatearMoneda(venta.total, divisa)}</span>
      </div>

      <div className="PendienteVenta-item">
        <label>Pagado:</label>
        <span>{formatearMoneda(venta.pagado, divisa)}</span>
      </div>

      <div className="PendienteVenta-item">
        <label>Pendiente:</label>
        <span>{formatearMoneda(venta.pendiente, divisa)}</span>
      </div>
    </div>
  );
};
