import { EstadoAccion } from "#/crm/comun/componentes/estado_accion.tsx";
import { TipoAccion } from "#/crm/comun/componentes/tipo_accion.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.js";
import {
  Detalle,
  QBoton,
  QInput,
  Tab,
  Tabs,
} from "@olula/componentes/index.js";
import { EmitirEvento, Entidad } from "@olula/lib/diseño.js";
import { useModelo } from "@olula/lib/useModelo.js";
import { useParams } from "react-router";
import { BorrarAccion } from "../borrar/BorrarAccion.tsx";
import { Accion } from "../diseño.ts";
import { FinalizarAccion } from "../finalizar/FinalizarAccion.tsx";
import { accionVacia, metaAccion } from "./detalle.ts";
import "./DetalleAccion.css";
import { getMaquina } from "./maquina.ts";
import { TabDatos } from "./tabs/TabDatos.tsx";
import { TabObservaciones } from "./tabs/TabObservaciones.tsx";

export const DetalleAccion = ({
  inicial = null,
  publicar,
}: {
  inicial: Accion | null;
  publicar: EmitirEvento;
}) => {
  const params = useParams();

  const accionId = inicial?.id ?? params.id;
  const titulo = (accion: Entidad) => accion.descripcion as string;

  const accion = useModelo(metaAccion, inicial ?? accionVacia);
  const { modelo, modeloInicial, modificado, uiProps, valido, init } = accion;

  const { ctx, emitir } = useMaquina(
    getMaquina,
    {
      estado: "INICIAL",
      accion: modelo,
      inicial: modeloInicial,
    },
    publicar
  );

  if (ctx.accion !== modeloInicial) {
    init(ctx.accion);
  }

  const guardar = async () => {
    emitir("accion_cambiada", modelo);
  };

  const cancelar = () => {
    emitir("edicion_accion_cancelada");
  };

  if (accionId && accionId !== modelo.id) {
    emitir("accion_id_cambiada", accionId);
  }

  return (
    <Detalle
      id={accionId}
      obtenerTitulo={titulo}
      setEntidad={() => {}}
      entidad={modelo}
      cerrarDetalle={() => emitir("edicion_accion_cancelada", null)}
    >
      {!!accionId && (
        <div className="DetalleAccion">
          <div className="maestro-botones ">
            <QBoton onClick={() => emitir("finalizacion_accion_solicitada")}>
              Finalizar
            </QBoton>
            <QBoton onClick={() => emitir("borrado_accion_solicitado")}>
              Borrar
            </QBoton>
          </div>

          <Tabs>
            <Tab label="Datos">
              <div className="TabDatos">
                <quimera-formulario>
                  <QInput label="Descripción" {...uiProps("descripcion")} />
                  <QInput label="Fecha" {...uiProps("fecha")} />
                  <EstadoAccion {...uiProps("estado")} />
                  <TipoAccion {...uiProps("tipo")} />
                </quimera-formulario>
              </div>
            </Tab>

            <Tab label="Más datos">
              <TabDatos accion={accion} />
            </Tab>

            <Tab label="Observaciones">
              <TabObservaciones accion={accion} />
            </Tab>
          </Tabs>

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

          {ctx.estado === "FINALIZANDO" && (
            <FinalizarAccion publicar={emitir} accion={modelo} />
          )}

          {ctx.estado === "BORRANDO" && (
            <BorrarAccion publicar={emitir} accion={modelo} />
          )}
        </div>
      )}
    </Detalle>
  );
};
