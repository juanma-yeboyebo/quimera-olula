import { BorrarAccion } from "#/crm/accion/borrar/BorrarAccion.tsx";
import { nuevaAccionVacia } from "#/crm/accion/crear/crear.ts";
import { CrearAccion } from "#/crm/accion/crear/CrearAccion.tsx";
import { Accion } from "#/crm/accion/diseño.ts";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.js";
import { ListadoSemiControlado } from "@olula/componentes/maestro/ListadoSemiControlado.tsx";
import { criteriaDefecto } from "@olula/lib/dominio.js";
import { listaEntidadesInicial } from "@olula/lib/ListaEntidades.js";
import { HookModelo } from "@olula/lib/useModelo.ts";
import { useCallback, useEffect, useState } from "react";
import { Incidencia } from "../../diseño.ts";
import { metaTablaAccion } from "./acciones.ts";
import { getMaquina } from "./maquina.ts";

export const Acciones = ({
  incidencia,
}: {
  incidencia: HookModelo<Incidencia>;
}) => {
  const [cargando, setCargando] = useState(false);

  const { ctx, emitir } = useMaquina(getMaquina, {
    estado: "INICIAL",
    acciones: listaEntidadesInicial<Accion>(),
  });

  const { modelo } = incidencia;

  const recargar = useCallback(async () => {
    setCargando(true);
    await emitir("recarga_de_acciones_solicitada", modelo.id);
    setCargando(false);
  }, [emitir, setCargando, modelo.id]);

  useEffect(() => {
    recargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelo.id]);

  return (
    <div className="TabAcciones">
      <div className="maestro-botones">
        <QBoton onClick={() => emitir("creacion_de_accion_solicitada")}>
          Nueva
        </QBoton>

        <QBoton
          onClick={() => emitir("borrado_accion_solicitado")}
          deshabilitado={!ctx.acciones.activo}
        >
          Borrar
        </QBoton>
      </div>

      {ctx.estado === "CREANDO" && (
        <CrearAccion
          publicar={emitir}
          modeloVacio={{
            ...nuevaAccionVacia,
            incidencia_id: modelo.id,
          }}
        />
      )}

      {ctx.estado === "BORRANDO" && ctx.acciones.activo && (
        <BorrarAccion publicar={emitir} accion={ctx.acciones.activo} />
      )}

      <ListadoSemiControlado
        metaTabla={metaTablaAccion}
        entidades={ctx.acciones.lista}
        totalEntidades={ctx.acciones.lista.length}
        cargando={cargando}
        seleccionada={ctx.acciones.activo ?? null}
        onSeleccion={(accion) => emitir("accion_seleccionada", accion)}
        criteriaInicial={criteriaDefecto}
        onCriteriaChanged={() => null}
      />
    </div>
  );
};
