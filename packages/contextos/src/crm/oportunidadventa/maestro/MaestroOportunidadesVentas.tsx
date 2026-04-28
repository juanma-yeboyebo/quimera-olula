import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.js";
import { Listado } from "@olula/componentes/maestro/Listado.js";
import { MaestroDetalle } from "@olula/componentes/maestro/MaestroDetalle.tsx";
import { listaActivaEntidadesInicial } from "@olula/lib/ListaActivaEntidades.js";
import { getUrlParams, useUrlParams } from "@olula/lib/url-params.js";
import { useEffect } from "react";
import { CrearOportunidadVenta } from "../crear/CrearOportunidadVenta.tsx";
import { DetalleOportunidadVenta } from "../detalle/DetalleOportunidadVenta.tsx";
import { OportunidadVenta } from "../diseño.ts";
import { TarjetaOportunidadVenta } from "../vistas/TarjetaOportunidadVenta.tsx";
import { metaTablaOportunidadVenta } from "./maestro.ts";
import "./MaestroOportunidadesVenta.css";
import { getMaquina } from "./maquina.ts";

export const MaestroOportunidades = () => {
  const { id, criteria } = getUrlParams();

  const { ctx, emitir } = useMaquina(getMaquina, {
    estado: "INICIAL",
    oportunidades: listaActivaEntidadesInicial<OportunidadVenta>(id, criteria),
  });

  useUrlParams(ctx.oportunidades.activo, ctx.oportunidades.criteria);

  useEffect(() => {
    emitir("recarga_de_oportunidades_solicitada", ctx.oportunidades.criteria);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="OportunidadesVenta">
      <MaestroDetalle<OportunidadVenta>
        Maestro={
          <>
            <h2>Oportunidades de Venta</h2>

            <Listado<OportunidadVenta>
              metaTabla={metaTablaOportunidadVenta}
              criteria={ctx.oportunidades.criteria}
              modo={"tabla"}
              tarjeta={(oportunidad) => (
                <TarjetaOportunidadVenta oportunidad={oportunidad} />
              )}
              entidades={ctx.oportunidades.lista}
              totalEntidades={ctx.oportunidades.total}
              seleccionada={ctx.oportunidades.activo}
              renderAcciones={() => (
                <div className="maestro-botones">
                  <QBoton
                    onClick={() => emitir("creacion_de_oportunidad_solicitada")}
                  >
                    Nueva
                  </QBoton>
                </div>
              )}
              onSeleccion={(payload) =>
                emitir("oportunidad_seleccionada", payload)
              }
              onCriteriaChanged={(payload) =>
                emitir("criteria_cambiado", payload)
              }
            />
          </>
        }
        Detalle={
          <DetalleOportunidadVenta
            id={ctx.oportunidades.activo}
            publicar={emitir}
          />
        }
        seleccionada={ctx.oportunidades.activo}
        modoDisposicion="maestro-50"
      />

      {ctx.estado === "CREANDO" && <CrearOportunidadVenta publicar={emitir} />}
    </div>
  );
};
