import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.js";
import { Listado } from "@olula/componentes/maestro/Listado.js";
import { MaestroDetalle } from "@olula/componentes/maestro/MaestroDetalle.tsx";
import { listaActivaEntidadesInicial } from "@olula/lib/ListaActivaEntidades.js";
import { getUrlParams, useUrlParams } from "@olula/lib/url-params.js";
import { useEffect } from "react";
import { CrearEstadoOportunidad } from "../crear/CrearEstadoOportunidad.tsx";
import { DetalleEstadoOportunidad } from "../detalle/DetalleEstadoOportunidad.tsx";
import { EstadoOportunidad } from "../diseño.ts";
import { metaTablaEstadoOportunidad } from "./maestro.ts";
import "./MaestroEstadosOportunidad.css";
import { getMaquina } from "./maquina.ts";

export const MaestroEstadosOportunidad = () => {
  const { id, criteria } = getUrlParams();

  const { ctx, emitir } = useMaquina(getMaquina, {
    estado: "INICIAL",
    estados_oportunidad: listaActivaEntidadesInicial<EstadoOportunidad>(
      id,
      criteria
    ),
  });

  useUrlParams(
    ctx.estados_oportunidad.activo,
    ctx.estados_oportunidad.criteria
  );

  useEffect(() => {
    emitir(
      "recarga_de_estados_oportunidad_solicitada",
      ctx.estados_oportunidad.criteria
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="EstadoOportunidad">
      <MaestroDetalle<EstadoOportunidad>
        Maestro={
          <>
            <h2>Estados de Oportunidad de Venta</h2>

            <Listado<EstadoOportunidad>
              metaTabla={metaTablaEstadoOportunidad}
              criteria={ctx.estados_oportunidad.criteria}
              modo={"tabla"}
              entidades={ctx.estados_oportunidad.lista}
              totalEntidades={ctx.estados_oportunidad.total}
              seleccionada={ctx.estados_oportunidad.activo}
              renderAcciones={() => (
                <div className="maestro-botones">
                  <QBoton
                    onClick={() =>
                      emitir("creacion_de_estado_oportunidad_solicitada")
                    }
                  >
                    Nuevo
                  </QBoton>
                </div>
              )}
              onSeleccion={(payload) =>
                emitir("estado_oportunidad_seleccionado", payload)
              }
              onCriteriaChanged={(payload) =>
                emitir("criteria_cambiado", payload)
              }
            />
          </>
        }
        Detalle={
          <DetalleEstadoOportunidad
            id={ctx.estados_oportunidad.activo}
            publicar={emitir}
          />
        }
        seleccionada={ctx.estados_oportunidad.activo}
        modoDisposicion="maestro-50"
      />

      {ctx.estado === "CREANDO" && <CrearEstadoOportunidad publicar={emitir} />}
    </div>
  );
};
