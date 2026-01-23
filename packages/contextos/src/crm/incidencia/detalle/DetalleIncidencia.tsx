import { useMaquina } from "@olula/componentes/hook/useMaquina.js";
import { Detalle, QBoton, Tab, Tabs } from "@olula/componentes/index.js";
import { EmitirEvento, Entidad } from "@olula/lib/diseño.js";
import { useModelo } from "@olula/lib/useModelo.js";
import { useParams } from "react-router";
import { BorrarIncidencia } from "../borrar/BorrarIncidencia.tsx";
import { Incidencia } from "../diseño.ts";
import { Acciones } from "./acciones/Acciones.tsx";
import { incidenciaVacia, metaIncidencia } from "./detalle.ts";
import "./DetalleIncidencia.css";
import { getMaquina } from "./maquina.ts";
import { TabGeneral } from "./tabs/TabGeneral.tsx";

export const DetalleIncidencia = ({
  inicial = null,
  publicar,
}: {
  inicial: Incidencia | null;
  publicar: EmitirEvento;
}) => {
  const params = useParams();

  const incidenciaId = inicial?.id ?? params.id;
  const titulo = (incidencia: Entidad) => incidencia.descripcion as string;

  const incidencia = useModelo(metaIncidencia, incidenciaVacia);
  const { modelo, modeloInicial, modificado, valido, init } = incidencia;

  const { ctx, emitir } = useMaquina(
    getMaquina,
    {
      estado: "INICIAL",
      incidencia: modelo,
      inicial: modeloInicial,
    },
    publicar
  );

  if (ctx.incidencia !== modeloInicial) {
    init(ctx.incidencia);
  }

  const guardar = async () => {
    emitir("incidencia_cambiada", modelo);
  };

  const cancelar = () => {
    emitir("edicion_incidencia_cancelada");
  };

  if (incidenciaId && incidenciaId !== modelo.id) {
    emitir("incidencia_id_cambiado", incidenciaId);
  }

  return (
    <Detalle
      id={incidenciaId}
      obtenerTitulo={titulo}
      setEntidad={() => {}}
      entidad={modelo}
      cerrarDetalle={() => emitir("edicion_incidencia_cancelada", null)}
    >
      {!!incidenciaId && (
        <div className="DetalleIncidencia">
          <div className="maestro-botones ">
            <QBoton onClick={() => emitir("borrado_incidencia_solicitado")}>
              Borrar
            </QBoton>
          </div>

          <Tabs>
            <Tab label="General">
              <TabGeneral incidencia={incidencia} />
            </Tab>

            <Tab label="Acciones">
              <Acciones incidencia={incidencia} />
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

          {ctx.estado === "BORRANDO" && (
            <BorrarIncidencia publicar={emitir} incidencia={modelo} />
          )}
        </div>
      )}
    </Detalle>
  );
};
