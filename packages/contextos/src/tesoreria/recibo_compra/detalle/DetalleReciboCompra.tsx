import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { Detalle } from "@olula/componentes/detalle/Detalle.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.js";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useModelo } from "@olula/lib/useModelo.js";
import { useEffect } from "react";
import { ReciboCompra } from "../diseño.js";
import {
  contextoDetalleReciboCompraInicial,
  metaReciboCompra,
} from "./detalle.js";
import "./DetalleReciboCompra.css";
import { getMaquina } from "./maquina.js";

export const DetalleReciboCompra = ({
  id,
  publicar = async () => {},
}: {
  id?: string;
  publicar?: EmitirEvento;
}) => {
  const { ctx, emitir } = useMaquina(
    getMaquina,
    contextoDetalleReciboCompraInicial,
    publicar
  );

  const { uiProps } = useModelo(metaReciboCompra, ctx.recibo);

  useEffect(() => {
    emitir("recibo_id_cambiado", id, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!ctx.recibo.id) return null;

  const titulo = (r: ReciboCompra) => r.codigo || `Recibo ${r.id}`;

  return (
    <Detalle
      id={id}
      obtenerTitulo={titulo}
      setEntidad={() => {}}
      entidad={ctx.recibo}
      cerrarDetalle={() => emitir("recibo_deseleccionado", null, true)}
    >
      <div className="DetalleReciboCompra">
        <quimera-formulario>
          <QInput label="Código" {...uiProps("codigo")} />
          <QInput label="Estado" {...uiProps("estado")} />
          <QInput label="Importe" {...uiProps("importe")} />
          <QInput label="Fecha de emisión" {...uiProps("fechaEmision")} />
          <QInput label="Fecha de vencimiento" {...uiProps("fechaVencimiento")} />
          <QInput label="Proveedor" {...uiProps("nombreProveedor")} />
          <QInput label="ID Fiscal" {...uiProps("idFiscal")} />
          <QInput label="Factura" {...uiProps("facturaId")} />
        </quimera-formulario>
      </div>
    </Detalle>
  );
};
