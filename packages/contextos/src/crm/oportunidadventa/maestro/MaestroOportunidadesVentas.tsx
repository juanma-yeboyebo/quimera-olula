import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.js";
import { QAvatar, QTarjetaGenerica } from "@olula/componentes/index.js";
import { Listado } from "@olula/componentes/maestro/Listado.js";
import { MaestroDetalle } from "@olula/componentes/maestro/MaestroDetalle.tsx";
import { useEsMovil } from "@olula/componentes/maestro/useEsMovil.js";
import { formatearFechaDate } from "@olula/lib/dominio.js";
import { listaActivaEntidadesInicial } from "@olula/lib/ListaActivaEntidades.js";
import { getUrlParams, useUrlParams } from "@olula/lib/url-params.js";
import { useCallback, useEffect, useState } from "react";
import { CrearOportunidadVenta } from "../crear/CrearOportunidadVenta.tsx";
import { DetalleOportunidadVenta } from "../detalle/DetalleOportunidadVenta.tsx";
import { OportunidadVenta } from "../diseño.ts";
import { metaTablaOportunidadVenta } from "./maestro.ts";
import "./MaestroOportunidadesVenta.css";
import { getMaquina } from "./maquina.ts";

type Layout = "TABLA" | "TARJETA";

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

  const esMovil = useEsMovil();
  const [layout, setLayout] = useState<Layout>("TARJETA");

  const cambiarLayout = useCallback(
    () => setLayout(layout === "TARJETA" ? "TABLA" : "TARJETA"),
    [layout, setLayout]
  );

  return (
    <div className="OportunidadesVenta">
      <MaestroDetalle<OportunidadVenta>
        Maestro={
          <>
            <h2>Oportunidades de Venta</h2>
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

            <Listado<OportunidadVenta>
              metaTabla={metaTablaOportunidadVenta}
              criteria={ctx.oportunidades.criteria}
              modo={esMovil || layout === "TARJETA" ? "tarjetas" : "tabla"}
              tarjeta={TarjetaOportunidadVenta}
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

const TarjetaOportunidadVenta = (oportunidad: OportunidadVenta) => {
  const probabilidad =
    oportunidad.probabilidad >= 75
      ? "muyprobable"
      : oportunidad.probabilidad >= 50
        ? "probable"
        : "improbable";

  return (
    <QTarjetaGenerica
      avatar={
        <QAvatar className={probabilidad}>
          {oportunidad.probabilidad + "%"}
        </QAvatar>
      }
      arribaIzquierda={oportunidad.descripcion}
      arribaDerecha={
        oportunidad.fecha_cierre
          ? formatearFechaDate(oportunidad.fecha_cierre)
          : ""
      }
      abajoIzquierda={oportunidad.nombre_cliente}
      abajoDerecha={oportunidad.importe + " €"}
    />
  );
};
