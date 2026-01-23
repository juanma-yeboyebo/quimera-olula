import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { Detalle } from "@olula/componentes/detalle/Detalle.tsx";
import { Tab, Tabs } from "@olula/componentes/detalle/tabs/Tabs.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { EmitirEvento, Entidad } from "@olula/lib/diseño.ts";
import { ConfigMaquina4, useMaquina4 } from "@olula/lib/useMaquina.ts";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useContext } from "react";
import { useParams } from "react-router";
import { BorrarContacto } from "../../borrar/BorrarContacto.tsx";
import { Contacto } from "../../diseño.ts";
import { contactoVacio, metaContacto } from "../../dominio.ts";
import { getContacto, patchContacto } from "../../infraestructura.ts";
import { TabClientes } from "./Clientes/TabClientes.tsx";
import "./DetalleContacto.css";
import { TabAcciones } from "./TabAcciones.tsx";
import { TabGeneral } from "./TabGeneral.tsx";
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
      contacto_guardado: ({ publicar }) => publicar("contacto_guardado"),
      cancelar_seleccion: ({ publicar }) => publicar("cancelar_seleccion"),
    },
    borrando: {
      borrado_contacto_cancelado: "edicion",
      contacto_borrado: ({ publicar }) => publicar("contacto_borrado"),
    },
  },
};

export const DetalleContacto = ({
  contactoInicial = null,
  publicar = () => {},
}: {
  contactoInicial?: Contacto | null;
  publicar?: EmitirEvento;
}) => {
  const params = useParams();
  const contactoId = contactoInicial?.id ?? params.id;
  const titulo = (contacto: Entidad) => contacto.nombre as string;
  const { intentar } = useContext(ContextoError);
  const contacto = useModelo(metaContacto, contactoVacio);
  const { modelo, init, modificado, valido } = contacto;

  const [emitir, { estado }] = useMaquina4<Estado, Contexto>({
    config: configMaquina,
    publicar,
  });

  const onGuardarClicked = async () => {
    await intentar(() => patchContacto(modelo.id, modelo));
    onRecargarContacto();
    emitir("contacto_guardado");
  };

  const onRecargarContacto = async () => {
    const contactoRecargado = await getContacto(modelo.id);
    init(contactoRecargado);
    publicar("contacto_cambiado", contactoRecargado);
  };

  return (
    <div className="DetalleContacto">
      <Detalle
        id={contactoId}
        obtenerTitulo={titulo}
        setEntidad={(c) => init(c as Contacto)}
        entidad={modelo}
        cargar={getContacto}
        className="detalle-contacto"
        cerrarDetalle={() => publicar("seleccion_cancelada")}
      >
        {!!contactoId && (
          <div className="DetalleContacto">
            <div className="maestro-botones ">
              <QBoton onClick={() => emitir("borrar")}>Borrar</QBoton>
            </div>

            <Tabs>
              <Tab label="General">
                <TabGeneral contacto={contacto} />
              </Tab>

              <Tab label="Clientes">
                <div className="detalle-cliente-tab-contenido">
                  <TabClientes contacto={contacto} />
                </div>
              </Tab>

              <Tab label="Oportunidades">
                <div className="detalle-cliente-tab-contenido">
                  <TabOportunidades contacto={contacto} />
                </div>
              </Tab>

              <Tab label="Acciones">
                <div className="detalle-cliente-tab-contenido">
                  <TabAcciones contacto={contacto} />
                </div>
              </Tab>
            </Tabs>

            {contacto.modificado && (
              <div className="maestro-botones ">
                <QBoton onClick={onGuardarClicked} deshabilitado={!valido}>
                  Guardar
                </QBoton>
                <QBoton
                  tipo="reset"
                  variante="texto"
                  onClick={() => init()}
                  deshabilitado={!modificado}
                >
                  Cancelar
                </QBoton>
              </div>
            )}

            {estado === "borrando" && (
              <BorrarContacto publicar={emitir} contacto={modelo} />
            )}
          </div>
        )}
      </Detalle>
    </div>
  );
};
