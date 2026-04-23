import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.js";
import { QAvatar, QIcono, QTarjetaGenerica } from "@olula/componentes/index.js";
import { Listado } from "@olula/componentes/maestro/Listado.js";
import { MaestroDetalle } from "@olula/componentes/maestro/MaestroDetalle.tsx";
import { useEsMovil } from "@olula/componentes/maestro/useEsMovil.js";
import { formatearFechaDate } from "@olula/lib/dominio.js";
import { listaActivaEntidadesInicial } from "@olula/lib/ListaActivaEntidades.js";
import { getUrlParams, useUrlParams } from "@olula/lib/url-params.js";
import { useCallback, useEffect, useState } from "react";
import { CrearIncidencia } from "../crear/CrearIncidencia.tsx";
import { DetalleIncidencia } from "../detalle/DetalleIncidencia.tsx";
import { Incidencia } from "../diseño.ts";
import { metaTablaIncidencia } from "./maestro.ts";
import "./MaestroIncidencias.css";
import { getMaquina } from "./maquina.ts";

type Layout = "TABLA" | "TARJETA";

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

  const esMovil = useEsMovil();
  const [layout, setLayout] = useState<Layout>("TARJETA");

  const cambiarLayout = useCallback(
    () => setLayout(layout === "TARJETA" ? "TABLA" : "TARJETA"),
    [layout, setLayout]
  );

  return (
    <div className="MaestroIncidencias">
      <MaestroDetalle<Incidencia>
        Maestro={
          <>
            <h2>Incidencias</h2>
            {!esMovil && (
              <div className="maestro-botones">
                <QBoton
                  texto={
                    layout === "TARJETA"
                      ? "Cambiar a TABLA"
                      : "Cambiar a TARJETA"
                  }
                  onClick={cambiarLayout}
                />
              </div>
            )}

            <div className="maestro-botones">
              <QBoton
                onClick={() => emitir("creacion_de_incidencia_solicitada")}
              >
                Nueva
              </QBoton>
            </div>

            <Listado<Incidencia>
              metaTabla={metaTablaIncidencia}
              criteria={ctx.incidencias.criteria}
              modo={esMovil || layout === "TARJETA" ? "tarjetas" : "tabla"}
              tarjeta={TarjetaCrmIncidencia}
              entidades={ctx.incidencias.lista}
              totalEntidades={ctx.incidencias.total}
              seleccionada={ctx.incidencias.activo}
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

const iconoEstadoAccion = (estado: string) => {
  const icono = {
    nueva: "estrella",
    en_espera: "relojarena",
    asignada: "usuario",
    rechazada: "cerrar",
    cerrada: "checkdoble",
  };

  return icono[estado as keyof typeof icono];
};

const TarjetaCrmIncidencia = (incidencia: Incidencia) => {
  return (
    <QTarjetaGenerica
      avatar={
        <QAvatar className={incidencia.prioridad}>
          <QIcono nombre={iconoEstadoAccion(incidencia.estado)} tamaño="sm" />
        </QAvatar>
      }
      arribaIzquierda={incidencia.nombre}
      arribaDerecha={formatearFechaDate(incidencia.fecha)}
      abajoIzquierda={
        incidencia.estado.at(0)?.toUpperCase() +
        incidencia.estado.slice(1).replace("_", " ")
      }
      abajoDerecha={incidencia.descripcion}
    />
  );
};
