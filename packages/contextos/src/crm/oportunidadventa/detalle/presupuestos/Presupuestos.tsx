// import { BorrarPresupuesto } from "#/crm/presupuesto/borrar/BorrarPresupuesto.tsx";
// import { nuevaPresupuestoVacia } from "#/crm/presupuesto/crear/crear.ts";
// import { CrearPresupuesto } from "#/crm/presupuesto/crear/CrearPresupuesto.tsx";
import { Presupuesto } from "#/ventas/presupuesto/diseño.ts";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.js";
import { ListadoSemiControlado } from "@olula/componentes/maestro/ListadoSemiControlado.tsx";
import { listaEntidadesInicial } from "@olula/lib/ListaEntidades.js";
import { criteriaDefecto } from "@olula/lib/dominio.js";
import { HookModelo } from "@olula/lib/useModelo.ts";
import { useCallback, useEffect, useState } from "react";
import { OportunidadVenta } from "../../diseño.ts";
import { getMaquina } from "./maquina.ts";
import { metaTablaPresupuesto } from "./presupuestos.ts";

export const Presupuestos = ({
  oportunidad,
}: {
  oportunidad: HookModelo<OportunidadVenta>;
}) => {
  const [cargando, setCargando] = useState(false);

  const { ctx, emitir } = useMaquina(getMaquina, {
    estado: "INICIAL",
    presupuestos: listaEntidadesInicial<Presupuesto>(),
  });

  const { modelo } = oportunidad;

  const recargar = useCallback(async () => {
    setCargando(true);
    await emitir("recarga_de_presupuestos_solicitada", modelo.id);
    setCargando(false);
  }, [emitir, setCargando, modelo.id]);

  useEffect(() => {
    recargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelo.id]);

  return (
    <div className="TabPresupuestos">
      {/* {ctx.estado === "CREANDO" && (
        <CrearPresupuesto
          publicar={emitir}
          modeloVacio={{
            ...nuevaPresupuestoVacia,
            oportunidad_id: modelo.id,
          }}
        />
      )}

      {ctx.estado === "BORRANDO" && ctx.presupuestos.activo && (
        <BorrarPresupuesto
          publicar={emitir}
          presupuesto={ctx.presupuestos.activo}
        />
      )} */}

      <ListadoSemiControlado
        metaTabla={metaTablaPresupuesto}
        entidades={ctx.presupuestos.lista}
        totalEntidades={ctx.presupuestos.lista.length}
        cargando={cargando}
        renderAcciones={() => (
          <div className="maestro-botones">
            <QBoton
              onClick={() => emitir("creacion_de_presupuesto_solicitada")}
            >
              Nueva
            </QBoton>

            <QBoton
              onClick={() => emitir("borrado_presupuesto_solicitado")}
              deshabilitado={!ctx.presupuestos.activo}
            >
              Borrar
            </QBoton>
          </div>
        )}
        seleccionada={ctx.presupuestos.activo ?? null}
        onSeleccion={(presupuesto) =>
          emitir("presupuesto_seleccionado", presupuesto)
        }
        criteriaInicial={criteriaDefecto}
        onCriteriaChanged={() => null}
      />
    </div>
  );
};
