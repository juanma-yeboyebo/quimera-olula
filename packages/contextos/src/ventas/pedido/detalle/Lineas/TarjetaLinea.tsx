import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { formatearMoneda } from "@olula/lib/dominio.ts";
import { useEffect, useState } from "react";
import { LineaPedido as Linea } from "../../diseño.ts";
import "./TarjetaLinea.css";

export const TarjetaLinea = ({
  linea,
  pedidoEditable,
  onCambioCantidad,
}: {
  linea: Linea;
  pedidoEditable?: boolean;
  onCambioCantidad?: (linea: Linea, cantidad: number) => void;
}) => {
  const [cantidadInput, setCantidadInput] = useState(
    String(Number(linea.cantidad) || 0)
  );

  const cantidad = Number(linea.cantidad) || 0;
  const iva = linea.grupo_iva_producto_id
    ? `${linea.grupo_iva_producto_id}%`
    : "N/A";
  const dto = linea.dto_porcentual ? `${linea.dto_porcentual}%` : "0%";

  useEffect(() => {
    setCantidadInput(String(cantidad));
  }, [cantidad]);

  const actualizarCantidad = (nuevaCantidad: number) => {
    if (!pedidoEditable || !onCambioCantidad) return;

    const cantidadValida = Math.max(1, Math.floor(nuevaCantidad));
    setCantidadInput(String(cantidadValida));
    if (cantidadValida !== cantidad) {
      onCambioCantidad(linea, cantidadValida);
    }
  };

  const confirmarCantidadInput = (valorRaw?: string) => {
    const valorAValidar = valorRaw ?? cantidadInput;
    const parsed = Number(valorAValidar);
    if (!Number.isFinite(parsed)) {
      setCantidadInput(String(cantidad));
      return;
    }

    actualizarCantidad(parsed);
  };

  return (
    <div className="linea-pedido-tarjeta">
      <div className="linea-pedido-tarjeta-cabecera">
        <div className="linea-pedido-tarjeta-identidad">
          <span className="linea-pedido-tarjeta-referencia">
            {linea.referencia || "Sin referencia"}
          </span>
          <span className="linea-pedido-tarjeta-descripcion">
            {linea.descripcion}
          </span>
          <span className="linea-pedido-tarjeta-resumen">
            {formatearMoneda(linea.pvp_unitario, "EUR")} · IVA {iva} · Dto {dto}
          </span>
        </div>
        <div className="linea-pedido-tarjeta-total">
          {formatearMoneda(linea.pvp_total, "EUR")}
        </div>
      </div>

      <div className="linea-pedido-tarjeta-cuerpo">
        {pedidoEditable && onCambioCantidad ? (
          <div className="linea-pedido-stepper">
            <div className="linea-pedido-stepper-control">
              <QBoton
                variante="borde"
                tamaño="pequeño"
                onClick={(e) => {
                  e.stopPropagation();
                  actualizarCantidad(cantidad - 1);
                }}
                props={{ "aria-label": "Disminuir cantidad" }}
              >
                -
              </QBoton>
            </div>

            <div
              className="linea-pedido-stepper-input-wrapper"
              onClick={(e) => e.stopPropagation()}
            >
              <QInput
                label=""
                nombre="cantidad"
                tipo="numero"
                valor={cantidadInput}
                autoSeleccion
                onChange={(valor) => setCantidadInput(valor)}
                onBlur={(valor) => confirmarCantidadInput(valor)}
                onEnterKeyUp={(valor) => confirmarCantidadInput(valor)}
              />
            </div>

            <div className="linea-pedido-stepper-control">
              <QBoton
                variante="borde"
                tamaño="pequeño"
                onClick={(e) => {
                  e.stopPropagation();
                  actualizarCantidad(cantidad + 1);
                }}
                props={{ "aria-label": "Aumentar cantidad" }}
              >
                +
              </QBoton>
            </div>
          </div>
        ) : (
          <div className="linea-pedido-cantidad-lectura">
            Cantidad: {cantidad}
          </div>
        )}
      </div>
    </div>
  );
};
