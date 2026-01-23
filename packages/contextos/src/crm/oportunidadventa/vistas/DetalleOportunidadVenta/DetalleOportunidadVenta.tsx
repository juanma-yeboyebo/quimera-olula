import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { Detalle } from "@olula/componentes/detalle/Detalle.tsx";
import { Tab, Tabs } from "@olula/componentes/detalle/tabs/Tabs.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { EmitirEvento, Entidad } from "@olula/lib/diseño.ts";
import { ConfigMaquina4, useMaquina4 } from "@olula/lib/useMaquina.ts";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useContext } from "react";
import { useParams } from "react-router";
import { OportunidadVenta } from "../../diseño.ts";
import { metaOportunidadVenta, oportunidadVentaVacia } from "../../dominio.ts";
import {
  getOportunidadVenta,
  patchOportunidadVenta,
} from "../../infraestructura.ts";
// import "./DetalleOportunidadVenta.css";
import { BorrarOportunidadVenta } from "../../borrar/BorrarOportunidadVenta.tsx";
import { TabPresupuestos } from "./Presupuestos/TabPresupuestos.tsx";
import { TabAcciones } from "./TabAcciones.tsx";
import { TabDatos } from "./TabDatos.tsx";
import { TabObservaciones } from "./TabObservaciones.tsx";

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
      oportunidad_guardada: ({ publicar }) => publicar("oportunidad_cambiada"),
      cancelar_seleccion: ({ publicar }) => publicar("seleccion_cancelada"),
    },
    borrando: {
      borrado_oportunidad_cancelado: "edicion",
      oportunidad_borrada: ({ publicar }) => publicar("oportunidad_borrada"),
    },
  },
};

export const DetalleOportunidadVenta = ({
  oportunidadInicial = null,
  publicar = () => {},
}: {
  oportunidadInicial?: OportunidadVenta | null;
  publicar?: EmitirEvento;
}) => {
  const params = useParams();
  const oportunidadId = oportunidadInicial?.id ?? params.id;
  const titulo = (oportunidad: Entidad) => oportunidad.descripcion as string;
  const { intentar } = useContext(ContextoError);

  const oportunidad = useModelo(metaOportunidadVenta, oportunidadVentaVacia);
  const { modelo, init, valido } = oportunidad;

  const [emitir, { estado }] = useMaquina4<Estado, Contexto>({
    config: configMaquina,
    publicar: publicar,
  });

  const onGuardarClicked = async () => {
    await intentar(() => patchOportunidadVenta(modelo.id, modelo));
    const oportunidad_guardada = await getOportunidadVenta(modelo.id);
    init(oportunidad_guardada);
    publicar("oportunidad_cambiada", oportunidad_guardada);
  };

  return (
    <Detalle
      id={oportunidadId}
      obtenerTitulo={titulo}
      setEntidad={(o) => init(o)}
      entidad={modelo}
      cargar={getOportunidadVenta}
      cerrarDetalle={() => emitir("cancelar_seleccion")}
    >
      {!!oportunidadId && (
        <>
          <div className="maestro-botones ">
            <QBoton onClick={() => emitir("borrar")}>Borrar</QBoton>
          </div>

          <Tabs>
            <Tab label="Datos">
              <TabDatos oportunidad={oportunidad} />
            </Tab>

            <Tab label="Observaciones">
              <TabObservaciones oportunidad={oportunidad} />
            </Tab>

            <Tab label="Acciones">
              <TabAcciones oportunidad={oportunidad} />
            </Tab>

            <Tab label="Presupuestos">
              <TabPresupuestos oportunidad={oportunidad} />
            </Tab>
          </Tabs>

          {oportunidad.modificado && (
            <div className="botones maestro-botones">
              <QBoton onClick={onGuardarClicked} deshabilitado={!valido}>
                Guardar
              </QBoton>
              <QBoton tipo="reset" variante="texto" onClick={() => init()}>
                Cancelar
              </QBoton>
            </div>
          )}
          {estado === "borrando" && (
            <BorrarOportunidadVenta oportunidad={modelo} publicar={emitir} />
          )}
        </>
      )}
    </Detalle>
  );
};
