import { useMaquina } from "@olula/componentes/hook/useMaquina.js";
import {
  Detalle,
  QBoton,
  QCheckbox,
  QInput,
} from "@olula/componentes/index.js";
import { EmitirEvento, Entidad } from "@olula/lib/diseño.js";
import { useModelo } from "@olula/lib/useModelo.js";
import { useParams } from "react-router";
import { BorrarEstadoOportunidad } from "../borrar/BorrarEstadoOportunidad.tsx";
import { EstadoOportunidad } from "../diseño.ts";
import { estadoOportunidadVacio, metaEstadoOportunidad } from "./detalle.ts";
import "./DetalleEstadoOportunidad.css";
import { getMaquina } from "./maquina.ts";

export const DetalleEstadoOportunidad = ({
  inicial = null,
  publicar,
}: {
  inicial: EstadoOportunidad | null;
  publicar: EmitirEvento;
}) => {
  const params = useParams();

  const estadoOportunidadId = inicial?.id ?? params.id;
  const titulo = (estado_oportunidad: Entidad) =>
    estado_oportunidad.descripcion as string;

  const estado_oportunidad = useModelo(
    metaEstadoOportunidad,
    estadoOportunidadVacio
  );
  const { modelo, modeloInicial, modificado, uiProps, valido, init } =
    estado_oportunidad;

  const { ctx, emitir } = useMaquina(
    getMaquina,
    {
      estado: "INICIAL",
      estado_oportunidad: modelo,
      inicial: modeloInicial,
    },
    publicar
  );

  if (ctx.estado_oportunidad !== modeloInicial) {
    init(ctx.estado_oportunidad);
  }

  const guardar = async () => {
    emitir("estado_oportunidad_cambiado", modelo);
  };

  const cancelar = () => {
    emitir("edicion_estado_oportunidad_cancelada");
  };

  if (estadoOportunidadId && estadoOportunidadId !== modelo.id) {
    emitir("estado_oportunidad_id_cambiado", estadoOportunidadId);
  }

  return (
    <Detalle
      id={estadoOportunidadId}
      obtenerTitulo={titulo}
      setEntidad={() => {}}
      entidad={modelo}
      cerrarDetalle={() => emitir("edicion_estado_oportunidad_cancelada", null)}
    >
      {!!estadoOportunidadId && (
        <div className="DetalleEstadoOportunidad">
          <div className="maestro-botones ">
            <QBoton
              onClick={() => emitir("borrado_estado_oportunidad_solicitado")}
            >
              Borrar
            </QBoton>
          </div>

          <quimera-formulario>
            <QInput label="Descripción" {...uiProps("descripcion")} />
            <QInput label="Probabilidad (%)" {...uiProps("probabilidad")} />
            <QCheckbox
              label="Valor por defecto"
              {...uiProps("valor_defecto")}
            />
          </quimera-formulario>

          {modificado && (
            <div className="botones maestro-botones">
              <QBoton onClick={guardar} deshabilitado={!valido}>
                Guardar
              </QBoton>
              <QBoton tipo="reset" variante="texto" onClick={cancelar}>
                Cancelar
              </QBoton>
            </div>
          )}

          {ctx.estado === "BORRANDO" && (
            <BorrarEstadoOportunidad
              publicar={emitir}
              estado_oportunidad={modelo}
            />
          )}
        </div>
      )}
    </Detalle>
  );
};
