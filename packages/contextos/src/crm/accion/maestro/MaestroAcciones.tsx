import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.js";
import { Listado } from "@olula/componentes/maestro/Listado.js";
import { MaestroDetalle } from "@olula/componentes/maestro/MaestroDetalle.tsx";
import { listaActivaEntidadesInicial } from "@olula/lib/ListaActivaEntidades.js";
import { getUrlParams, useUrlParams } from "@olula/lib/url-params.js";
import { useEffect } from "react";
import { CrearAccion } from "../crear/CrearAccion.tsx";
import { DetalleAccion } from "../detalle/DetalleAccion.tsx";
import { Accion } from "../diseño.ts";
import { metaTablaAccion } from "./maestro.ts";
import "./MaestroAcciones.css";
import { getMaquina } from "./maquina.ts";

export const MaestroAcciones = () => {
  const { id, criteria } = getUrlParams();

  const { ctx, emitir } = useMaquina(getMaquina, {
    estado: "INICIAL",
    acciones: listaActivaEntidadesInicial<Accion>(id, criteria),
  });

  useUrlParams(ctx.acciones.activo, ctx.acciones.criteria);

  useEffect(() => {
    emitir("recarga_de_acciones_solicitada", ctx.acciones.criteria);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="MaestroAcciones">
      <MaestroDetalle<Accion>
        Maestro={
          <>
            <h2>Acciones</h2>

            <Listado<Accion>
              metaTabla={metaTablaAccion}
              criteria={ctx.acciones.criteria}
              modo={"tabla"}
              entidades={ctx.acciones.lista}
              totalEntidades={ctx.acciones.total}
              seleccionada={ctx.acciones.activo}
              renderAcciones={() => (
                <div className="maestro-botones">
                  <QBoton
                    onClick={() => emitir("creacion_de_accion_solicitada")}
                  >
                    Nueva
                  </QBoton>
                </div>
              )}
              onSeleccion={(payload) => emitir("accion_seleccionada", payload)}
              onCriteriaChanged={(payload) =>
                emitir("criteria_cambiado", payload)
              }
            />
          </>
        }
        Detalle={<DetalleAccion id={ctx.acciones.activo} publicar={emitir} />}
        seleccionada={ctx.acciones.activo}
        modoDisposicion="maestro-50"
      />

      {ctx.estado === "CREANDO" && <CrearAccion publicar={emitir} />}
    </div>
  );
};
