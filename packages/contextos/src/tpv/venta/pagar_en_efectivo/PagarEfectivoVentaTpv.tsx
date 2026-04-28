import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QModal } from "@olula/componentes/index.js";
import { ContextoError } from "@olula/lib/contexto.js";
import { EmitirEvento } from "@olula/lib/diseño.js";
import { formatearMoneda, redondeaMoneda } from "@olula/lib/dominio.js";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useCallback, useContext, useState } from "react";
import { VentaTpv } from "../diseño.ts";
import { postPago } from "../infraestructura.ts";
import {
  metaNuevoPagoEfectivo,
  nuevoPagoEfectivoInicial,
} from "./pagar_en_efectivo.ts";
import "./PagarEfectivoVentaTpv.css";

export const PagarEfectivoVentaTpv = ({
  publicar,
  venta,
}: {
  publicar: EmitirEvento;
  venta: VentaTpv;
}) => {
  const pendiente = redondeaMoneda(venta.total - venta.pagado, venta.divisa_id);

  const { modelo, uiProps, valido, set } = useModelo(
    metaNuevoPagoEfectivo,
    nuevoPagoEfectivoInicial
  );

  const [pagando, setPagando] = useState(false);

  const { intentar } = useContext(ContextoError);

  const pagar = useCallback(
    async () => {
      const idPago = await intentar(() =>
        postPago(venta.id, {
          importe: Math.min(pendiente, modelo.importe),
          formaPago: "EFECTIVO",
        })
      );
      setPagando(true);
      publicar("pago_en_efectivo_hecho", idPago);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [modelo, publicar, venta.id]
  );

  const cancelar = useCallback(() => {
    if (!pagando) publicar("pago_cancelado");
  }, [pagando, publicar]);

  const sumar = (valor: number) => {
    return () => {
      setImporte(Number(modelo.importe) + valor);
    };
  };

  const setImporte = (v: number) => {
    set({
      ...modelo,
      importe: v,
    });
  };

  const limpiar = () => {
    setImporte(0);
  };

  const cambio = redondeaMoneda(
    modelo.importe - pendiente > 0 ? modelo.importe - pendiente : 0,
    venta.divisa_id
  );

  return (
    <QModal
      abierto={true}
      nombre="mostrar"
      titulo="Pagar en efectivo"
      onCerrar={cancelar}
    >
      <div className="PagarEfectivoVentaTpv">
        <quimera-formulario>
          <div id="pendiente">
            {`A pagar: ${formatearMoneda(pendiente, venta.divisa_id)}. Cambio: ${formatearMoneda(cambio, venta.divisa_id)}`}
          </div>

          <QInput label="Importe" {...uiProps("importe")} />
        </quimera-formulario>

        <div className="botones maestro-botones ">
          <QBoton onClick={limpiar}>Limpiar</QBoton>
        </div>

        <div className="botones maestro-botones ">
          <QBoton onClick={sumar(0.01)}>0,01€</QBoton>
          <QBoton onClick={sumar(0.02)}>0,02€</QBoton>
          <QBoton onClick={sumar(0.05)}>0,05€</QBoton>
          <QBoton onClick={sumar(0.1)}>0,10€</QBoton>
          <QBoton onClick={sumar(0.2)}>0,20€</QBoton>
          <QBoton onClick={sumar(0.5)}>0,50€</QBoton>
          <QBoton onClick={sumar(1)}>1€</QBoton>
          <QBoton onClick={sumar(2)}>2€</QBoton>
        </div>

        <div className="botones maestro-botones ">
          <QBoton onClick={sumar(5)}>5€</QBoton>
          <QBoton onClick={sumar(10)}>10€</QBoton>
          <QBoton onClick={sumar(20)}>20€</QBoton>
          <QBoton onClick={sumar(50)}>50€</QBoton>
          <QBoton onClick={sumar(100)}>100€</QBoton>
          <QBoton onClick={sumar(200)}>200€</QBoton>
          <QBoton onClick={sumar(500)}>500€</QBoton>
        </div>

        <div className="botones maestro-botones ">
          <QBoton onClick={pagar} deshabilitado={!valido}>
            Pagar
          </QBoton>
        </div>
      </div>
    </QModal>
  );
};
