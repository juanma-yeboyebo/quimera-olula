import { BorrarOportunidadVenta } from "#/crm/oportunidadventa/borrar/BorrarOportunidadVenta.tsx";
import { nuevaOportunidadVentaVacia } from "#/crm/oportunidadventa/crear/crear.ts";
import { CrearOportunidadVenta } from "#/crm/oportunidadventa/crear/CrearOportunidadVenta.tsx";
import { OportunidadVenta } from "#/crm/oportunidadventa/diseño.ts";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.js";
import { ListadoSemiControlado } from "@olula/componentes/maestro/ListadoSemiControlado.tsx";
import { criteriaDefecto } from "@olula/lib/dominio.js";
import { listaEntidadesInicial } from "@olula/lib/ListaEntidades.js";
import { HookModelo } from "@olula/lib/useModelo.ts";
import { useCallback, useEffect, useState } from "react";
import { Lead } from "../../diseño.ts";
import { getMaquina } from "./maquina.ts";
import { metaTablaOportunidades } from "./oportunidades.ts";

export const Oportunidades = ({ lead }: { lead: HookModelo<Lead> }) => {
  const [cargando, setCargando] = useState(false);

  const { ctx, emitir } = useMaquina(getMaquina, {
    estado: "INICIAL",
    oportunidades: listaEntidadesInicial<OportunidadVenta>(),
  });

  const { modelo } = lead;

  const recargar = useCallback(async () => {
    setCargando(true);
    await emitir("recarga_de_oportunidades_solicitada", modelo.id);
    setCargando(false);
  }, [emitir, setCargando, modelo.id]);

  useEffect(() => {
    recargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelo.id]);

  return (
    <div className="TabOportunidades">
      {ctx.estado === "CREANDO" && (
        <CrearOportunidadVenta
          publicar={emitir}
          modeloVacio={{
            ...nuevaOportunidadVentaVacia,
            tarjeta_id: modelo.id,
          }}
        />
      )}

      {ctx.estado === "BORRANDO" && ctx.oportunidades.activo && (
        <BorrarOportunidadVenta
          publicar={emitir}
          oportunidad={ctx.oportunidades.activo}
        />
      )}

      <ListadoSemiControlado
        metaTabla={metaTablaOportunidades}
        entidades={ctx.oportunidades.lista}
        totalEntidades={ctx.oportunidades.lista.length}
        cargando={cargando}
        renderAcciones={() => (
          <div className="maestro-botones">
            <QBoton
              onClick={() => emitir("creacion_de_oportunidad_solicitada")}
            >
              Nueva
            </QBoton>

            <QBoton
              onClick={() => emitir("borrado_oportunidad_solicitado")}
              deshabilitado={!ctx.oportunidades.activo}
            >
              Borrar
            </QBoton>
          </div>
        )}
        seleccionada={ctx.oportunidades.activo ?? null}
        onSeleccion={(oportunidad) =>
          emitir("oportunidad_seleccionada", oportunidad)
        }
        criteriaInicial={criteriaDefecto}
        onCriteriaChanged={() => null}
      />
    </div>
  );
};
