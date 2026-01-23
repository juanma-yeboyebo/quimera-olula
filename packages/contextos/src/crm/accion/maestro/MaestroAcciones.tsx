import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.js";
import { ListadoControlado } from "@olula/componentes/maestro/ListadoControlado.js";
import { MaestroDetalleControlado } from "@olula/componentes/maestro/MaestroDetalleControlado.tsx";
import { Criteria } from "@olula/lib/diseño.js";
import { criteriaDefecto } from "@olula/lib/dominio.js";
import { listaEntidadesInicial } from "@olula/lib/ListaEntidades.js";
import { useCallback, useEffect, useState } from "react";
import { CrearAccion } from "../crear/CrearAccion.tsx";
import { DetalleAccion } from "../detalle/DetalleAccion.tsx";
import { Accion } from "../diseño.ts";
import { metaTablaAccion } from "./maestro.ts";
import "./MaestroAcciones.css";
import { getMaquina } from "./maquina.ts";

export const MaestroAcciones = () => {
  const [cargando, setCargando] = useState(false);

  const { ctx, emitir } = useMaquina(getMaquina, {
    estado: "INICIAL",
    acciones: listaEntidadesInicial<Accion>(),
  });

  const crear = useCallback(
    () => emitir("creacion_de_accion_solicitada"),
    [emitir]
  );

  const setSeleccionado = useCallback(
    (payload: Accion) => emitir("accion_seleccionada", payload),
    [emitir]
  );

  const recargar = useCallback(
    async (criteria: Criteria) => {
      setCargando(true);
      await emitir("recarga_de_acciones_solicitada", criteria);
      setCargando(false);
    },
    [emitir, setCargando]
  );

  useEffect(() => {
    recargar(criteriaDefecto);
  }, []);

  return (
    <div className="MaestroAcciones">
      <MaestroDetalleControlado<Accion>
        Maestro={
          <>
            <h2>Acciones</h2>
            <div className="maestro-botones">
              <QBoton onClick={crear}>Nueva</QBoton>
            </div>
            <ListadoControlado<Accion>
              metaTabla={metaTablaAccion}
              metaFiltro={true}
              cargando={cargando}
              criteriaInicial={criteriaDefecto}
              modo={"tabla"}
              // setModo={handleSetModoVisualizacion}
              // tarjeta={tarjeta}
              entidades={ctx.acciones.lista}
              totalEntidades={ctx.acciones.total}
              seleccionada={ctx.acciones.activo}
              onSeleccion={setSeleccionado}
              onCriteriaChanged={recargar}
            />
          </>
        }
        Detalle={
          <DetalleAccion inicial={ctx.acciones.activo} publicar={emitir} />
        }
        seleccionada={ctx.acciones.activo}
        modoDisposicion="maestro-50"
      />

      {ctx.estado === "CREANDO" && <CrearAccion publicar={emitir} />}
    </div>
  );
};
