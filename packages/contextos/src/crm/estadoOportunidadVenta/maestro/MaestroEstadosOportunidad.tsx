import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.js";
import { ListadoControlado } from "@olula/componentes/maestro/ListadoControlado.js";
import { MaestroDetalleControlado } from "@olula/componentes/maestro/MaestroDetalleControlado.tsx";
import { Criteria } from "@olula/lib/diseño.js";
import { criteriaDefecto } from "@olula/lib/dominio.js";
import { useCallback, useEffect, useState } from "react";
import { CrearEstadoOportunidad } from "../crear/CrearEstadoOportunidad.tsx";
// import { DetalleEstadoOportunidad } from "../Detalle/DetalleEstadoOportunidad.tsx";
import { DetalleEstadoOportunidad } from "../detalle/DetalleEstadoOportunidad.tsx";
import { EstadoOportunidad } from "../diseño.ts";
import { metaTablaEstadoOportunidad } from "./maestro.ts";
import "./MaestroEstadosOportunidad.css";
import { getMaquina } from "./maquina.ts";

export const MaestroEstadosOportunidad = () => {
  const [cargando, setCargando] = useState(false);

  const { ctx, emitir } = useMaquina(getMaquina, {
    estado: "INICIAL",
    estados_oportunidad: [],
    totalEstadosOportunidad: 0,
    activo: null,
  });

  const crear = useCallback(
    () => emitir("creacion_de_estado_oportunidad_solicitada"),
    [emitir]
  );

  const setSeleccionado = useCallback(
    (payload: EstadoOportunidad) =>
      emitir("estado_oportunidad_seleccionado", payload),
    [emitir]
  );

  const recargar = useCallback(
    async (criteria: Criteria) => {
      setCargando(true);
      await emitir("recarga_de_estados_oportunidad_solicitada", criteria);
      setCargando(false);
    },
    [emitir, setCargando]
  );

  useEffect(() => {
    recargar(criteriaDefecto);
  }, []);

  return (
    <div className="EstadoOportunidad">
      <MaestroDetalleControlado<EstadoOportunidad>
        Maestro={
          <>
            <h2>Estados de Oportunidad de Venta</h2>
            <div className="maestro-botones">
              <QBoton onClick={crear}>Nuevo</QBoton>
            </div>
            <ListadoControlado<EstadoOportunidad>
              metaTabla={metaTablaEstadoOportunidad}
              metaFiltro={true}
              cargando={cargando}
              criteriaInicial={criteriaDefecto}
              modo={"tabla"}
              // setModo={handleSetModoVisualizacion}
              // tarjeta={tarjeta}
              entidades={ctx.estados_oportunidad}
              totalEntidades={ctx.totalEstadosOportunidad}
              seleccionada={ctx.activo}
              onSeleccion={setSeleccionado}
              onCriteriaChanged={recargar}
            />
          </>
        }
        Detalle={
          <DetalleEstadoOportunidad inicial={ctx.activo} publicar={emitir} />
        }
        seleccionada={ctx.activo}
        modoDisposicion="maestro-50"
      />
      {ctx.estado === "CREANDO" && <CrearEstadoOportunidad publicar={emitir} />}
    </div>
  );
};
