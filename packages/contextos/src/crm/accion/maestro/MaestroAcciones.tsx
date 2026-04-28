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
import { CrearAccion } from "../crear/CrearAccion.tsx";
import { DetalleAccion } from "../detalle/DetalleAccion.tsx";
import { Accion } from "../diseño.ts";
import { metaTablaAccion } from "./maestro.ts";
import "./MaestroAcciones.css";
import { getMaquina } from "./maquina.ts";

type Layout = "TABLA" | "TARJETA";

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

  const esMovil = useEsMovil();
  const [layout, setLayout] = useState<Layout>("TARJETA");

  const cambiarLayout = useCallback(
    () => setLayout(layout === "TARJETA" ? "TABLA" : "TARJETA"),
    [layout, setLayout]
  );

  return (
    <div className="MaestroAcciones">
      <MaestroDetalle<Accion>
        Maestro={
          <>
            <h2>Acciones</h2>
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

            <Listado<Accion>
              metaTabla={metaTablaAccion}
              criteria={ctx.acciones.criteria}
              modo={esMovil || layout === "TARJETA" ? "tarjetas" : "tabla"}
              tarjeta={TarjetaCrmAccion}
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
        layout={layout}
        seleccionada={ctx.acciones.activo}
        modoDisposicion="maestro-50"
      />

      {ctx.estado === "CREANDO" && <CrearAccion publicar={emitir} />}
    </div>
  );
};

const iconoTipoAccion = (tipo: string) => {
  const icono = {
    Tarea: "tarea",
    "E-mail": "correo",
    Teléfono: "telefono",
    Visita: "casa",
    Otro: "llaveinglesa",
  };

  return icono[tipo as keyof typeof icono];
};

const TarjetaCrmAccion = (accion: Accion) => {
  return (
    <QTarjetaGenerica
      avatar={
        <QAvatar className={accion.estado}>
          <QIcono nombre={iconoTipoAccion(accion.tipo)} tamaño="sm" />
        </QAvatar>
      }
      arribaIzquierda={accion.descripcion}
      arribaDerecha={accion.fecha ? formatearFechaDate(accion.fecha) : ""}
      abajoIzquierda={accion.estado}
      abajoDerecha={accion.nombre_cliente}
    />
  );
};
