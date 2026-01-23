import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.js";
import { ListadoControlado } from "@olula/componentes/maestro/ListadoControlado.js";
import { MaestroDetalleControlado } from "@olula/componentes/maestro/MaestroDetalleControlado.tsx";
import { Criteria } from "@olula/lib/diseño.js";
import { criteriaDefecto } from "@olula/lib/dominio.js";
import { listaEntidadesInicial } from "@olula/lib/ListaEntidades.js";
import { useCallback, useEffect, useState } from "react";
import { CrearIncidencia } from "../crear/CrearIncidencia.tsx";
import { DetalleIncidencia } from "../detalle/DetalleIncidencia.tsx";
import { Incidencia } from "../diseño.ts";
import { metaTablaIncidencia } from "./maestro.ts";
import "./MaestroIncidencias.css";
import { getMaquina } from "./maquina.ts";

export const MaestroIncidencias = () => {
  const [cargando, setCargando] = useState(false);

  const { ctx, emitir } = useMaquina(getMaquina, {
    estado: "INICIAL",
    incidencias: listaEntidadesInicial<Incidencia>(),
  });

  const crear = useCallback(
    () => emitir("creacion_de_incidencia_solicitada"),
    [emitir]
  );

  const setSeleccionado = useCallback(
    (payload: Incidencia) => emitir("incidencia_seleccionada", payload),
    [emitir]
  );

  const recargar = useCallback(
    async (criteria: Criteria) => {
      setCargando(true);
      await emitir("recarga_de_incidencias_solicitada", criteria);
      setCargando(false);
    },
    [emitir, setCargando]
  );

  useEffect(() => {
    recargar(criteriaDefecto);
  }, []);

  return (
    <div className="MaestroIncidencias">
      <MaestroDetalleControlado<Incidencia>
        Maestro={
          <>
            <h2>Incidencias</h2>
            <div className="maestro-botones">
              <QBoton onClick={crear}>Nueva</QBoton>
            </div>
            <ListadoControlado<Incidencia>
              metaTabla={metaTablaIncidencia}
              metaFiltro={true}
              cargando={cargando}
              criteriaInicial={criteriaDefecto}
              modo={"tabla"}
              // setModo={handleSetModoVisualizacion}
              // tarjeta={(incidencia) => (
              //   <TarjetaIncidencia incidencia={incidencia} />
              // )}
              entidades={ctx.incidencias.lista}
              totalEntidades={ctx.incidencias.total}
              seleccionada={ctx.incidencias.activo}
              onSeleccion={setSeleccionado}
              onCriteriaChanged={recargar}
            />
          </>
        }
        Detalle={
          <DetalleIncidencia
            inicial={ctx.incidencias.activo}
            publicar={emitir}
          />
        }
        seleccionada={ctx.incidencias.activo}
        modoDisposicion="maestro-50"
      />
      {ctx.estado === "CREANDO" && <CrearIncidencia publicar={emitir} />}
    </div>
  );
};
