import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.js";
import { Listado } from "@olula/componentes/maestro/Listado.js";
import { MaestroDetalle } from "@olula/componentes/maestro/MaestroDetalle.tsx";
import { listaActivaEntidadesInicial } from "@olula/lib/ListaActivaEntidades.js";
import { getUrlParams, useUrlParams } from "@olula/lib/url-params.js";
import { useEffect } from "react";
import { CrearIncidencia } from "../crear/CrearIncidencia.tsx";
import { DetalleIncidencia } from "../detalle/DetalleIncidencia.tsx";
import { Incidencia } from "../diseño.ts";
import { metaTablaIncidencia } from "./maestro.ts";
import "./MaestroIncidencias.css";
import { getMaquina } from "./maquina.ts";

export const MaestroIncidencias = () => {
  const { id, criteria } = getUrlParams();

  const { ctx, emitir } = useMaquina(getMaquina, {
    estado: "INICIAL",
    incidencias: listaActivaEntidadesInicial<Incidencia>(id, criteria),
  });

  useUrlParams(ctx.incidencias.activo, ctx.incidencias.criteria);

  useEffect(() => {
    emitir("recarga_de_incidencias_solicitada", ctx.incidencias.criteria);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="MaestroIncidencias">
      <MaestroDetalle<Incidencia>
        Maestro={
          <>
            <h2>Incidencias</h2>

            <Listado<Incidencia>
              metaTabla={metaTablaIncidencia}
              criteria={ctx.incidencias.criteria}
              modo={"tabla"}
              entidades={ctx.incidencias.lista}
              totalEntidades={ctx.incidencias.total}
              seleccionada={ctx.incidencias.activo}
              renderAcciones={() => (
                <div className="maestro-botones">
                  <QBoton
                    onClick={() => emitir("creacion_de_incidencia_solicitada")}
                  >
                    Nueva
                  </QBoton>
                </div>
              )}
              onSeleccion={(payload) =>
                emitir("incidencia_seleccionada", payload)
              }
              onCriteriaChanged={(payload) =>
                emitir("criteria_cambiado", payload)
              }
            />
          </>
        }
        Detalle={
          <DetalleIncidencia id={ctx.incidencias.activo} publicar={emitir} />
        }
        seleccionada={ctx.incidencias.activo}
        modoDisposicion="maestro-50"
      />

      {ctx.estado === "CREANDO" && <CrearIncidencia publicar={emitir} />}
    </div>
  );
};
