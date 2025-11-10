import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { Detalle } from "@olula/componentes/detalle/Detalle.tsx";
import { Tab, Tabs } from "@olula/componentes/detalle/tabs/Tabs.tsx";
import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { EmitirEvento, Entidad } from "@olula/lib/diseño.ts";
import { ConfigMaquina4, useMaquina4 } from "@olula/lib/useMaquina.ts";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useContext } from "react";
import { useParams } from "react-router";
import { Lead } from "../../diseño.ts";
import { leadVacio, metaLead } from "../../dominio.ts";
import { deleteLead, getLead, patchLead } from "../../infraestructura.ts";
import "./DetalleLead.css";
import { TabAcciones } from "./TabAcciones.tsx";
import { TabDatos } from "./TabDatos.tsx";
import { TabObservaciones } from "./TabObservaciones.tsx";
import { TabOportunidades } from "./TabOportunidades.tsx";

type Estado = "edicion" | "borrando";
type Contexto = Record<string, unknown>;

const configMaquina: ConfigMaquina4<Estado, Contexto> = {
  inicial: {
    estado: "edicion",
    contexto: {},
  },
  estados: {
    edicion: {
      borrar: "borrando",
      lead_guardado: ({ publicar }) => publicar("lead_guardado"),
      cancelar_seleccion: ({ publicar }) => publicar("cancelar_seleccion"),
    },
    borrando: {
      borrado_cancelado: "edicion",
      lead_borrado: ({ publicar }) => publicar("lead_borrado"),
    },
  },
};

export const DetalleLead = ({
  leadInicial = null,
  publicar = () => {},
}: {
  leadInicial?: Lead | null;
  publicar?: EmitirEvento;
}) => {
  const params = useParams();
  const leadId = leadInicial?.id ?? params.id;
  const titulo = (lead: Entidad) => lead.nombre as string;
  const { intentar } = useContext(ContextoError);

  const lead = useModelo(metaLead, leadVacio);
  const { modelo, init, modificado, valido } = lead;

  const [emitir, { estado }] = useMaquina4<Estado, Contexto>({
    config: configMaquina,
    publicar: publicar,
  });

  const onGuardarClicked = async () => {
    await intentar(() => patchLead(modelo.id, modelo));
    const lead_guardado = await getLead(modelo.id);
    init(lead_guardado);
    emitir("lead_cambiado", lead_guardado);
  };

  const onBorrarConfirmado = async () => {
    await intentar(() => deleteLead(modelo.id));
    emitir("lead_borrado", modelo);
    emitir("borrado_cancelado");
  };

  return (
    <Detalle
      id={leadId}
      obtenerTitulo={titulo}
      setEntidad={(l) => init(l)}
      entidad={modelo}
      cargar={getLead}
      cerrarDetalle={() => publicar("seleccion_cancelada")}
    >
      {!!leadId && (
        <>
          <div className="maestro-botones ">
            <QBoton onClick={() => emitir("borrar")}>Borrar</QBoton>
          </div>
          <Tabs
            children={[
              <Tab
                key="tab-1"
                label="Datos"
                children={<TabDatos lead={lead} />}
              />,
              <Tab
                key="tab-3"
                label="Observaciones"
                children={<TabObservaciones oportunidad={lead} />}
              />,
              <Tab
                key="tab-4"
                label="Oportunidades de Venta"
                children={<TabOportunidades lead={lead} />}
              />,
              <Tab
                key="tab-5"
                label="Acciones"
                children={<TabAcciones lead={lead} />}
              />,
            ]}
          ></Tabs>
          {modificado && (
            <div className="botones maestro-botones">
              <QBoton onClick={onGuardarClicked} deshabilitado={!valido}>
                Guardar
              </QBoton>
              <QBoton tipo="reset" variante="texto" onClick={() => init()}>
                Cancelar
              </QBoton>
            </div>
          )}
          <QModalConfirmacion
            nombre="borrarLead"
            abierto={estado === "borrando"}
            titulo="Confirmar borrar"
            mensaje="¿Está seguro de que desea borrar este lead?"
            onCerrar={() => emitir("borrado_cancelado")}
            onAceptar={onBorrarConfirmado}
          />
        </>
      )}
    </Detalle>
  );
};
