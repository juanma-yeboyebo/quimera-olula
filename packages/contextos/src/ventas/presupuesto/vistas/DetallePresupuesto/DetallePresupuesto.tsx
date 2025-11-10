import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { Detalle } from "@olula/componentes/detalle/Detalle.tsx";
import { Tab, Tabs } from "@olula/componentes/detalle/tabs/Tabs.tsx";
import {
  QModalConfirmacion,
  QuimeraAcciones,
} from "@olula/componentes/index.js";
import { ContextoError } from "@olula/lib/contexto.ts";
import { EmitirEvento, Entidad } from "@olula/lib/diseño.ts";
import { ConfigMaquina4, useMaquina4 } from "@olula/lib/useMaquina.js";
import { useModelo } from "@olula/lib/useModelo.ts";
import { JSX, useContext } from "react";
import { useParams } from "react-router";
import { TotalesVenta } from "../../../venta/vistas/TotalesVenta.tsx";
import { Presupuesto } from "../../diseño.ts";
import { metaPresupuesto, presupuestoVacio } from "../../dominio.ts";
import {
  aprobarPresupuesto,
  borrarPresupuesto,
  getPresupuesto,
  patchPresupuesto,
} from "../../infraestructura.ts";
import "./DetallePresupuesto.css";
import { Lineas } from "./Lineas/Lineas.tsx";
import { TabCliente } from "./TabCliente/TabCliente.tsx";
import { TabDatosProps } from "./TabDatosBase.tsx";
import { TabObservaciones } from "./TabObservaciones.tsx";

type ParamOpcion = {
  valor: string;
  descripcion?: string;
};
export type ValorControl = null | string | ParamOpcion;
type Estado = "editando" | "borrando";
type Contexto = Record<string, unknown>;

const configMaquina: ConfigMaquina4<Estado, Contexto> = {
  inicial: {
    estado: "editando",
    contexto: {},
  },
  estados: {
    editando: {
      borrar_presupuesto: "borrando",
      presupuesto_guardado: ({ publicar }) => publicar("presupuesto_guardado"),
    },
    borrando: {
      cancelar_borrado: "editando",
      borrar_confirmado: "editando",
      presupuesto_borrado: ({ publicar }) => publicar("presupuesto_borrado"),
    },
  },
};

export const DetallePresupuesto = ({
  TabDatos,
  presupuestoInicial = null,
  publicar = () => {},
}: {
  TabDatos: (props: TabDatosProps) => JSX.Element;
  presupuestoInicial?: Presupuesto | null;
  publicar?: EmitirEvento;
}) => {
  const params = useParams();
  const { intentar } = useContext(ContextoError);

  const presupuestoId = presupuestoInicial?.id ?? params.id;
  const titulo = (presupuesto: Entidad) => presupuesto.codigo as string;

  const presupuesto = useModelo(metaPresupuesto, presupuestoVacio());
  const { modelo, init } = presupuesto;

  const recargarCabecera = async () => {
    const nuevoPresupuesto = await getPresupuesto(modelo.id);
    init(nuevoPresupuesto);
    publicar("presupuesto_cambiado", nuevoPresupuesto);
  };

  const aprobar = async () => {
    await intentar(() => aprobarPresupuesto(modelo.id));
    await recargarCabecera();
    emitir("presupuesto_guardado");
  };

  const guardar = async () => {
    await intentar(() => patchPresupuesto(modelo.id, modelo));
    await recargarCabecera();
    emitir("presupuesto_guardado");
  };

  const onBorrarConfirmado = async () => {
    await intentar(() => borrarPresupuesto(modelo.id));
    emitir("presupuesto_borrado", modelo);
    emitir("borrar_confirmado");
  };

  const cancelar = () => {
    init();
  };

  const [emitir, { estado }] = useMaquina4<Estado, Contexto>({
    config: configMaquina,
    publicar,
  });

  const acciones = [
    {
      texto: "Aprobar",
      onClick: () => aprobar,
      deshabilitado: modelo.aprobado,
    },
    {
      icono: "eliminar",
      texto: "Borrar",
      onClick: () => emitir("borrar_presupuesto"),
      deshabilitado: modelo.aprobado,
    },
  ];

  return (
    <Detalle
      id={presupuestoId}
      obtenerTitulo={titulo}
      setEntidad={(p) => init(p)}
      entidad={modelo}
      cargar={getPresupuesto}
      cerrarDetalle={() => publicar("seleccion_presupuesto_cancelada")}
    >
      {!!presupuestoId && (
        <>
          {!modelo.aprobado && <QuimeraAcciones acciones={acciones} vertical />}
          <Tabs
            children={[
              <Tab
                key="tab-1"
                label="Cliente"
                children={
                  <TabCliente
                    presupuesto={presupuesto}
                    publicar={() => recargarCabecera()}
                  />
                }
              />,
              <Tab
                key="tab-2"
                label="Datos"
                children={<TabDatos presupuesto={presupuesto} />}
              />,
              <Tab
                key="tab-3"
                label="Observaciones"
                children={<TabObservaciones presupuesto={presupuesto} />}
              />,
            ]}
          ></Tabs>
          {presupuesto.modificado && (
            <div className="botones maestro-botones ">
              <QBoton onClick={guardar} deshabilitado={!presupuesto.valido}>
                Guardar
              </QBoton>
              <QBoton tipo="reset" variante="texto" onClick={cancelar}>
                Cancelar
              </QBoton>
            </div>
          )}

          <TotalesVenta
            neto={Number(modelo.neto ?? 0)}
            totalIva={Number(modelo.total_iva ?? 0)}
            total={Number(modelo.total ?? 0)}
            divisa={String(modelo.coddivisa ?? "EUR")}
          />
          <Lineas
            presupuestoId={presupuestoId}
            presupuestoEditable={presupuesto.editable}
            onCabeceraModificada={recargarCabecera}
          />

          <QModalConfirmacion
            nombre="borrarPresupuesto"
            abierto={estado === "borrando"}
            titulo="Confirmar borrar"
            mensaje="¿Está seguro de que desea borrar este pedido?"
            onCerrar={() => emitir("cancelar_borrado")}
            onAceptar={onBorrarConfirmado}
          />
        </>
      )}
    </Detalle>
  );
};
