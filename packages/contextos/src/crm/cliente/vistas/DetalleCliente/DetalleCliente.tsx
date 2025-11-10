import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { Detalle } from "@olula/componentes/detalle/Detalle.tsx";
import { Tab, Tabs } from "@olula/componentes/detalle/tabs/Tabs.tsx";
import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { EmitirEvento, Entidad } from "@olula/lib/diseño.ts";
import { ConfigMaquina4, useMaquina4 } from "@olula/lib/useMaquina.ts";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useParams } from "react-router";
import { TabCrmContactos } from "../../../../ventas/cliente/vistas/DetalleCliente/CRMContactos/TabCrmContactos.tsx";
import { TabDirecciones } from "../../../../ventas/cliente/vistas/DetalleCliente/Direcciones/TabDirecciones.tsx";
import { Cliente } from "../../diseño.ts";
import { clienteVacio, metaCliente } from "../../dominio.ts";
import {
  deleteCliente,
  getCliente,
  patchCliente,
} from "../../infraestructura.ts";
import "./DetalleCliente.css";
import { TabAcciones } from "./TabAcciones.tsx";
import { TabGeneral } from "./TabGeneral.tsx";
import { TabOportunidades } from "./TabOportunidades.tsx";

// Máquina de estados y contexto

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
      cliente_guardado: ({ publicar }) => publicar("cliente_cambiado"),
      cancelar_seleccion: ({ publicar }) => publicar("cancelar_seleccion"),
    },
    borrando: {
      borrado_cancelado: "edicion",
      cliente_borrado: ({ publicar }) => publicar("cliente_borrado"),
    },
  },
};

export const DetalleCliente = ({
  clienteInicial = null,
  publicar = () => {},
}: {
  clienteInicial?: Cliente | null;
  publicar?: EmitirEvento;
}) => {
  const params = useParams();
  const clienteId = clienteInicial?.id ?? params.id;
  const titulo = (cliente: Entidad) => cliente.nombre as string;
  const cliente = useModelo(metaCliente, clienteVacio());
  const { modelo, init, modificado, valido } = cliente;

  const [emitir, { estado }] = useMaquina4<Estado, Contexto>({
    config: configMaquina,
    publicar: publicar,
  });

  const onGuardarClicked = async () => {
    await patchCliente(modelo.id, modelo);
    const cliente_guardado = await getCliente(modelo.id);
    init(cliente_guardado);
    emitir("cliente_cambiado", cliente_guardado);
  };

  const onRecargarCliente = async () => {
    const clienteRecargado = await getCliente(modelo.id);
    init(clienteRecargado);
    emitir("cliente_guardado", clienteRecargado);
  };

  const onBorrarConfirmado = async () => {
    await deleteCliente(modelo.id);
    emitir("cliente_borrado", modelo);
    emitir("borrado_cancelado");
  };

  return (
    <div className="DetalleCliente">
      <Detalle
        id={clienteId}
        obtenerTitulo={titulo}
        setEntidad={(c) => init(c as Cliente)}
        entidad={modelo}
        cargar={getCliente}
        className="detalle-cliente"
        cerrarDetalle={() => publicar("seleccion_cancelada")}
      >
        {!!clienteId && (
          <div className="DetalleCliente">
            <div className="maestro-botones ">
              <QBoton onClick={() => emitir("borrar")}>Borrar</QBoton>
            </div>
            <Tabs
              children={[
                <Tab
                  key="tab-1"
                  label="General"
                  children={
                    <TabGeneral
                      cliente={cliente}
                      emitir={publicar}
                      recargarCliente={onRecargarCliente}
                    />
                  }
                />,
                <Tab
                  key="tab-1"
                  label="Contactos"
                  children={<TabCrmContactos clienteId={clienteId} />}
                />,
                <Tab
                  key="tab-2"
                  label="Direcciones"
                  children={<TabDirecciones clienteId={clienteId} />}
                />,
                <Tab
                  key="tab-4"
                  label="Oportunidades"
                  children={
                    <div className="detalle-cliente-tab-contenido">
                      <TabOportunidades cliente={cliente} />
                    </div>
                  }
                />,
                <Tab
                  key="tab-4"
                  label="Acciones"
                  children={
                    <div className="detalle-cliente-tab-contenido">
                      <TabAcciones cliente={cliente} />
                    </div>
                  }
                />,
              ]}
            />
            {cliente.modificado && (
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
            <QModalConfirmacion
              nombre="borrarCliente"
              abierto={estado === "borrando"}
              titulo="Confirmar borrar"
              mensaje="¿Está seguro de que desea borrar este cliente?"
              onCerrar={() => emitir("borrado_cancelado")}
              onAceptar={onBorrarConfirmado}
            />
          </div>
        )}
      </Detalle>
    </div>
  );
};
