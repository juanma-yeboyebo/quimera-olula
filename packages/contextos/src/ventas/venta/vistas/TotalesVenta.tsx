import { QBoton } from "@olula/componentes/index.js";
import { EmitirEvento } from "@olula/lib/diseño.js";
import { formatearMoneda } from "@olula/lib/dominio.ts";
import { HookModelo } from "@olula/lib/useModelo.js";
import { Venta } from "../diseño.ts";
import "./TotalesVenta.css";


interface TotalesVentaProps<T extends Venta> {
  modeloVenta: HookModelo<T>;
  publicar: EmitirEvento,
}

export const TotalesVenta = <T extends Venta>({
  modeloVenta,
  publicar,
}: TotalesVentaProps<T>) => {
    const venta = modeloVenta.modelo;
    return (
        <div className="totales-venta">

            {modeloVenta.editable && (
                <div className="botones maestro-botones ">

                        <QBoton onClick={() => publicar("descuento_solicitado", venta)}>
                            Descuento
                        </QBoton>

                </div>
            )}

            {venta.dtoPorcentual !== 0 && (
                <>
                    <div className="totales-venta-item">
                        <label>Neto s/dto:</label>
                        <span>{formatearMoneda(venta.netoSinDto, venta.divisa_id)}</span>
                    </div>
                    <div className="totales-venta-item">
                        <label>Dto. ({venta.dtoPorcentual}%):</label>
                        <span>{formatearMoneda(venta.netoSinDto - venta.neto, venta.divisa_id)}</span>
                    </div>
                </>
            )}
            <div className="totales-venta-item">
                <label>Neto:</label>
                <span>{formatearMoneda(venta.neto, venta.divisa_id)}</span>
            </div>
            <div className="totales-venta-item">
                <label>IVA:</label>
                <span>{formatearMoneda(venta.total_iva, venta.divisa_id)}</span>
            </div>
            <div className="totales-venta-item">
                <label>Total:</label>
                <span>{formatearMoneda(venta.total, venta.divisa_id)}</span>
            </div>
        </div>
    );
};
