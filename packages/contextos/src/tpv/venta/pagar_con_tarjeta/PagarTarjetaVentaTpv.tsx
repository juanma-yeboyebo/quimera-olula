import { VentaTpv } from "#/tpv/venta/diseño.ts";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QModal } from "@olula/componentes/index.js";
import { EmitirEvento } from "@olula/lib/diseño.js";
import { formatearMoneda, redondeaMoneda } from "@olula/lib/dominio.js";
import { useFocus } from "@olula/lib/useFocus.js";
import { useForm } from "@olula/lib/useForm.js";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useCallback, useMemo } from "react";
import { postPago } from "../infraestructura.ts";
import "./PagarTarjetaVentaTpv.css";
import {
  metaNuevoPagoTarjeta,
  nuevoPagoTarjetaInicial,
} from "./pagar_con_tarjeta.ts";

export const PagarTarjetaVentaTpv = ({
  publicar,
  venta,
}: {
  publicar: EmitirEvento;
  venta: VentaTpv;
}) => {
  const pendiente = redondeaMoneda(venta.total - venta.pagado, venta.divisa_id);

  const pagoInicial = useMemo(
    () => ({
      ...nuevoPagoTarjetaInicial,
      importe: pendiente,
      pendiente,
    }),
    [pendiente]
  );

  const { modelo, uiProps, valido, set } = useModelo(
    metaNuevoPagoTarjeta,
    pagoInicial
  );

  const pagar_ = useCallback(async () => {
    const idPago = await postPago(venta.id, {
      importe: modelo.importe,
      formaPago: "TARJETA",
    });
    publicar("pago_con_tarjeta_hecho", idPago);
  }, [modelo, publicar, venta.id]);

  const cancelar_ = useCallback(() => publicar("pago_cancelado"), [publicar]);

  const [pagar, cancelar] = useForm(pagar_, cancelar_);

  const setImporte = (v: number) => {
    set({
      ...modelo,
      importe: v,
    });
  };

  const limpiar = () => {
    setImporte(0);
  };

  const focus = useFocus(true);

  return (
    <QModal
      abierto={true}
      nombre="mostrar"
      titulo="Pago con tarjeta"
      onCerrar={cancelar}
    >
      <div className="PagarTarjetaVentaTpv">
        <quimera-formulario>
          <div id="pendiente">
            {`A pagar: ${formatearMoneda(pendiente, venta.divisa_id)}`}
          </div>

          <QInput label="Importe" {...uiProps("importe")} ref={focus} />
        </quimera-formulario>

        <div className="botones maestro-botones ">
          <QBoton onClick={limpiar}>Limpiar</QBoton>

          <QBoton texto="Pagar" onClick={pagar} deshabilitado={!valido} />
        </div>
      </div>
    </QModal>
  );
};
