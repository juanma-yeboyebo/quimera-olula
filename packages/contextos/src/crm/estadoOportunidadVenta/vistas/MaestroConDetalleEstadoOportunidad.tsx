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
  seleccionarItem,
} from "@olula/lib/entidad.ts";
import { pipe } from "@olula/lib/funcional.ts";
import {
  ConfigMaquina4,
  Maquina3,
  useMaquina4,
} from "@olula/lib/useMaquina.ts";
import { useCallback } from "react";
import { EstadoOportunidad } from "../diseño.ts";
import { metaTablaEstadoOportunidad } from "../dominio.ts";
import { getEstadosOportunidad } from "../infraestructura.ts";
import { AltaEstadoOportunidad } from "./AltaEstadoOportunidad.tsx";
import { DetalleEstadoOportunidad } from "./DetalleEstadoOportunidad/DetalleEstadoOportunidad.tsx";
// import "./MaestroConDetalleEstadoOportunidad.css";

type Estado = "inactivo" | "creando" | "borrando";
type Contexto = {
  estados: ListaSeleccionable<EstadoOportunidad>;
};

const setEstados =
  (
    aplicable: (
      estados: ListaSeleccionable<EstadoOportunidad>
    ) => ListaSeleccionable<EstadoOportunidad>
  ) =>
  (maquina: Maquina3<Estado, Contexto>) => {
    return {
      ...maquina,
      contexto: {
        ...maquina.contexto,
        estados: aplicable(maquina.contexto.estados),
      },
    };
  };

const configMaquina: ConfigMaquina4<Estado, Contexto> = {
  inicial: {
    estado: "inactivo",
    contexto: {
      estados: listaSeleccionableVacia<EstadoOportunidad>(),
    },
  },
  estados: {
    inactivo: {
      crear: "creando",
      estado_oportunidad_cambiado: ({ maquina, payload }) =>
        pipe(maquina, setEstados(cambiarItem(payload as EstadoOportunidad))),
      estado_oportunidad_seleccionado: ({ maquina, payload }) =>
        pipe(
          maquina,
          setEstados(seleccionarItem(payload as EstadoOportunidad))
        ),
      estado_oportunidad_borrado: ({ maquina }) => {
        const { estados } = maquina.contexto;
        if (!estados.idActivo) {
          return maquina;
        }
        return pipe(maquina, setEstados(quitarItem(estados.idActivo)));
      },
      estados_oportunidad_cargados: ({ maquina, payload }) =>
        pipe(maquina, setEstados(cargar(payload as EstadoOportunidad[]))),
      borrar: "borrando",
      seleccion_cancelada: ({ maquina }) =>
        pipe(
          maquina,
          setEstados((estados) => ({
            ...estados,
            idActivo: null,
          }))
        ),
    },
    creando: {
      estado_oportunidad_creado: ({ maquina, payload, setEstado }) =>
        pipe(
          maquina,
          setEstado("inactivo" as Estado),
          setEstados(incluirItem(payload as EstadoOportunidad, {}))
        ),
      creacion_cancelada: "inactivo",
    },
    borrando: {
      borrado_cancelado: "inactivo",
      borrado_confirmado: "inactivo",
    },
  },
};

export const MaestroConDetalleEstadoOportunidad = () => {
  // const { intentar } = useContext(ContextoError);
  const [emitir, { estado, contexto }] = useMaquina4<Estado, Contexto>({
    config: configMaquina,
  });
  const { estados } = contexto;

  const setEntidades = useCallback(
    (payload: EstadoOportunidad[]) =>
      emitir("estados_oportunidad_cargados", payload),
    [emitir]
  );
  const setSeleccionada = useCallback(
    (payload: EstadoOportunidad) =>
      emitir("estado_oportunidad_seleccionado", payload),
    [emitir]
  );

  const seleccionada = getSeleccionada(estados);

  return (
    <div className="EstadoOportunidad">
      <MaestroDetalle<EstadoOportunidad>
        seleccionada={seleccionada}
        preMaestro={
          <>
            <h2>Estados de Oportunidad</h2>
            <div className="maestro-botones">
              <QBoton onClick={() => emitir("crear")}>Nuevo</QBoton>
            </div>
          </>
        }
        modoVisualizacion="tabla"
        metaTabla={metaTablaEstadoOportunidad}
        entidades={estados.lista}
        setEntidades={setEntidades}
        setSeleccionada={setSeleccionada}
        cargar={getEstadosOportunidad}
        Detalle={
          <DetalleEstadoOportunidad
            estadoInicial={seleccionada}
            publicar={emitir}
          />
        }
      />
      <AltaEstadoOportunidad emitir={emitir} activo={estado === "creando"} />
    </div>
  );
};
