import { MaestroDetalle, QBoton } from "@olula/componentes/index.ts";
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
import { Almacen } from "../diseño.ts";
import { metaTablaAlmacen } from "../dominio.ts";
import { getAlmacenes } from "../infraestructura.ts";
import { CrearAlmacen } from "./CrearAlmacen.tsx";
import { DetalleAlmacen } from "./DetalleAlmacen/DetalleAlmacen.tsx";
// import { TarjetaAlmacen } from "./TarjetaAlmacen.tsx";

type Estado = "Inactivo" | "Creando";

type Contexto = {
  almacenes: ListaSeleccionable<Almacen>;
};

const setAlmacenes =
  (
    aplicable: (
      almacenes: ListaSeleccionable<Almacen>
    ) => ListaSeleccionable<Almacen>
  ) =>
  (maquina: Maquina3<Estado, Contexto>) => {
    return {
      ...maquina,
      contexto: {
        ...maquina.contexto,
        almacenes: aplicable(maquina.contexto.almacenes),
      },
    };
  };

const configMaquina: ConfigMaquina4<Estado, Contexto> = {
  inicial: {
    estado: "Inactivo",
    contexto: {
      almacenes: listaSeleccionableVacia<Almacen>(),
    },
  },
  estados: {
    Inactivo: {
      crear: "Creando",
      almacen_cambiado: ({ maquina, payload }) =>
        pipe(maquina, setAlmacenes(cambiarItem(payload as Almacen))),
      almacen_seleccionado: ({ maquina, payload }) =>
        pipe(maquina, setAlmacenes(seleccionarItem(payload as Almacen))),
      almacen_borrado: ({ maquina }) => {
        const { almacenes } = maquina.contexto;
        if (!almacenes.idActivo) {
          return maquina;
        }
        return pipe(maquina, setAlmacenes(quitarItem(almacenes.idActivo)));
      },
      almacenes_cargados: ({ maquina, payload, setEstado }) =>
        pipe(
          maquina,
          setEstado("Inactivo" as Estado),
          setAlmacenes(cargar(payload as Almacen[]))
        ),
      seleccion_cancelada: ({ maquina }) =>
        pipe(
          maquina,
          setAlmacenes((almacenes) => ({
            ...almacenes,
            idActivo: null,
          }))
        ),
    },
    Creando: {
      almacen_creado: ({ maquina, payload, setEstado }) =>
        pipe(
          maquina,
          setEstado("Inactivo" as Estado),
          setAlmacenes(incluirItem(payload as Almacen, {}))
        ),
      creacion_cancelada: "Inactivo",
    },
  },
};

export const MaestroConDetalleAlmacen = () => {
  const [emitir, { estado, contexto }] = useMaquina4<Estado, Contexto>({
    config: configMaquina,
  });
  const { almacenes } = contexto;

  const setEntidades = useCallback(
    (payload: Almacen[]) => emitir("almacenes_cargados", payload),
    [emitir]
  );
  const setSeleccionada = useCallback(
    (payload: Almacen) => emitir("almacen_seleccionado", payload),
    [emitir]
  );

  const seleccionada = getSeleccionada(almacenes);

  return (
    <div className="Almacen">
      <MaestroDetalle<Almacen>
        seleccionada={seleccionada}
        preMaestro={
          <>
            <h2>Almacenes</h2>
            <div className="maestro-botones">
              <QBoton onClick={() => emitir("crear")}>Nuevo</QBoton>
            </div>
          </>
        }
        metaTabla={metaTablaAlmacen}
        modoDisposicion="maestro-50"
        entidades={almacenes.lista}
        setEntidades={setEntidades}
        setSeleccionada={setSeleccionada}
        cargar={getAlmacenes}
        Detalle={
          <DetalleAlmacen
            key={seleccionada?.id}
            almacenInicial={seleccionada}
            publicar={emitir}
          />
        }
      />
      <CrearAlmacen publicar={emitir} activo={estado === "Creando"} />
    </div>
  );
};
