import { getTpvConfig } from "#/tpv/comun/dominio.ts";
import { TipoTarjetaTpv } from "#/tpv/comun/componentes/TipoTarjetaTpv.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QModal } from "@olula/componentes/index.js";
import { EmitirEvento } from "@olula/lib/diseño.js";
import { formatearMoneda, redondeaMoneda } from "@olula/lib/dominio.js";
import { useForm } from "@olula/lib/useForm.js";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useCallback, useEffect, useMemo, useState } from "react";
import { VentaTpv } from "../diseño.ts";
import { postPago } from "../infraestructura.ts";
import "./PagarTarjetaVentaTpv.css";
import { metaNuevoPagoTarjeta, nuevoPagoTarjetaInicial } from "./pagar_con_tarjeta.ts";

export const PagarTarjetaVentaTpv = ({
  publicar,
  venta,
}: {
  publicar: EmitirEvento;
  venta: VentaTpv;
}) => {
  const pendiente = redondeaMoneda(venta.pendiente, venta.divisa_id);

  const pagoInicial = useMemo(
    () => ({ ...nuevoPagoTarjetaInicial, importe: pendiente, pendiente }),
    [pendiente]
  );

  const { modelo, uiProps, valido, set } = useModelo(metaNuevoPagoTarjeta, pagoInicial);

  const [hasTiposTarjeta, setHasTiposTarjeta] = useState(false);
  const [idTipoTarjeta, setIdTipoTarjeta] = useState<string | null>(null);

  useEffect(() => {
    getTpvConfig().then((config) => {
      if (config.tiposTarjeta.length > 0) {
        setHasTiposTarjeta(true);
        const porDefecto = config.tiposTarjeta.find((t) => t.defecto);
        setIdTipoTarjeta(porDefecto?.id ?? null);
      }
    });
  }, []);

  const pagar_ = useCallback(async () => {
    await postPago(venta.id, {
      importe: modelo.importe,
      formaPago: "TARJETA",
      idTipoTarjeta,
    });
    publicar("pago_con_tarjeta_hecho");
  }, [modelo, publicar, venta.id, idTipoTarjeta]);

  const cancelar_ = useCallback(() => publicar("pago_cancelado"), [publicar]);

  const [pagar, cancelar] = useForm(pagar_, cancelar_);

  const setImporte = (v: number) => {
    set({ ...modelo, importe: v });
  };

  const limpiar = () => {
    setImporte(0);
  };

  return (
    <QModal
      abierto={true}
      nombre="pagar_tarjeta_venta_tpv"
      titulo="Pago con tarjeta"
      onCerrar={cancelar}
      anchoEstable
      pantallaCompletaMovil={false}
    >
      <div className="PagarTarjetaVentaTpv">
        <quimera-formulario>
          <div id="pendiente">
            {`A pagar: ${formatearMoneda(pendiente, venta.divisa_id)}`}
          </div>

          <QInput label="Importe" {...uiProps("importe")} />
          {hasTiposTarjeta && (
            <TipoTarjetaTpv
              valor={idTipoTarjeta ?? ""}
              onChange={(opcion) => setIdTipoTarjeta(opcion?.valor ?? null)}
            />
          )}
        </quimera-formulario>

        <div className="botones maestro-botones ">
          <QBoton onClick={limpiar}>Limpiar</QBoton>
          <QBoton onClick={pagar} deshabilitado={!valido}>
            Pagar
          </QBoton>
        </div>
      </div>
    </QModal>
  );
};
