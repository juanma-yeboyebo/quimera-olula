import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { MaestroDetalle } from "@olula/componentes/maestro/MaestroDetalle.js";
import { ListaSeleccionable } from "@olula/lib/diseño.ts";
import {
  cambiarItem,
  cargar,
  getSeleccionada,
  incluirItem,
  listaSeleccionableVacia,
  quitarItem,
  quitarSeleccion,
  seleccionarItem,
} from "@olula/lib/entidad.ts";
import { pipe } from "@olula/lib/funcional.ts";
import {
  ConfigMaquina4,
  Maquina3,
  useMaquina4,
} from "@olula/lib/useMaquina.ts";
import { JSX, useCallback } from "react";
import { Presupuesto } from "../diseño.ts";
import { metaTablaPresupuesto } from "../dominio.ts";
import { getPresupuestos } from "../infraestructura.ts";
import { CrearPresupuesto } from "./DetallePresupuesto/CrearPresupuesto.tsx";
import { DetallePresupuesto } from "./DetallePresupuesto/DetallePresupuesto.tsx";
import { TabDatosProps } from "./DetallePresupuesto/TabDatosBase.tsx";
import "./MaestroConDetallePresupuesto.css";

type Estado = "Inactivo" | "Creando";

type Contexto = {
  presupuestos: ListaSeleccionable<Presupuesto>;
};

const setPresupuestos =
  (
    aplicable: (
      presupuestos: ListaSeleccionable<Presupuesto>
    ) => ListaSeleccionable<Presupuesto>
  ) =>
  (maquina: Maquina3<Estado, Contexto>) => {
    return {
      ...maquina,
      contexto: {
        ...maquina.contexto,
        presupuestos: aplicable(maquina.contexto.presupuestos),
      },
    };
  };

const configMaquina: ConfigMaquina4<Estado, Contexto> = {
  inicial: {
    estado: "Inactivo",
    contexto: {
      presupuestos: listaSeleccionableVacia<Presupuesto>(),
    },
  },
  estados: {
    Inactivo: {
      crear: "Creando",
      presupuesto_cambiado: ({ maquina, payload }) =>
        pipe(maquina, setPresupuestos(cambiarItem(payload as Presupuesto))),
      presupuesto_seleccionado: ({ maquina, payload }) =>
        pipe(maquina, setPresupuestos(seleccionarItem(payload as Presupuesto))),
      seleccion_presupuesto_cancelada: ({ maquina }) =>
        pipe(maquina, setPresupuestos(quitarSeleccion())),
      presupuesto_borrado: ({ maquina }) => {
        const { presupuestos } = maquina.contexto;
        if (!presupuestos.idActivo) {
          return maquina;
        }
        return pipe(
          maquina,
          setPresupuestos(quitarItem(presupuestos.idActivo))
        );
      },
      presupuestos_cargados: ({ maquina, payload, setEstado }) =>
        pipe(
          maquina,
          setEstado("Inactivo" as Estado),
          setPresupuestos(cargar(payload as Presupuesto[]))
        ),
    },
    Creando: {
      presupuesto_creado: ({ maquina, payload, setEstado }) =>
        pipe(
          maquina,
          setEstado("Inactivo" as Estado),
          setPresupuestos(incluirItem(payload as Presupuesto, {}))
        ),
      creacion_presupuesto_cancelada: "Inactivo",
    },
  },
};

export interface MaestroConDetallePresupuestoProps {
  TabDatos: (props: TabDatosProps) => JSX.Element;
}

export const MaestroConDetallePresupuesto = ({
  TabDatos,
}: MaestroConDetallePresupuestoProps) => {
  const [emitir, { estado, contexto }] = useMaquina4<Estado, Contexto>({
    config: configMaquina,
  });
  const { presupuestos } = contexto;

  const setEntidades = useCallback(
    (payload: Presupuesto[]) => emitir("presupuestos_cargados", payload),
    [emitir]
  );
  const setSeleccionada = useCallback(
    (payload: Presupuesto) => emitir("presupuesto_seleccionado", payload),
    [emitir]
  );

  const seleccionada = getSeleccionada(presupuestos);

  return (
    <div className="Presupuesto">
      <MaestroDetalle<Presupuesto>
        seleccionada={seleccionada}
        preMaestro={
          <>
            <h2>Presupuestos</h2>
            <div className="maestro-botones">
              <QBoton onClick={() => emitir("crear")}>Crear Presupuesto</QBoton>
            </div>
          </>
        }
        modoVisualizacion="tabla"
        modoDisposicion="maestro-50"
        metaTabla={metaTablaPresupuesto}
        entidades={presupuestos.lista}
        setEntidades={setEntidades}
        setSeleccionada={setSeleccionada}
        cargar={getPresupuestos}
        Detalle={
          <DetallePresupuesto
            TabDatos={TabDatos}
            presupuestoInicial={seleccionada}
            publicar={emitir}
          />
        }
      />
      <CrearPresupuesto publicar={emitir} activo={estado === "Creando"} />
    </div>
  );
};
