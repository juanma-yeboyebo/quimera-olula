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
import { Articulo } from "../diseño.ts";
import { getArticulos } from "../infraestructura.ts";
import { CrearArticulo } from "./CrearArticulo.tsx";
import { DetalleArticulo } from "./DetalleArticulo/DetalleArticulo.tsx";

const metaTablaArticulo = [
  { id: "id", cabecera: "ID" },
  { id: "nombre", cabecera: "Nombre" },
  { id: "descripcion", cabecera: "Descripción" },
  { id: "estado", cabecera: "Estado" },
];

type Estado = "inactivo" | "creando" | "borrando";
type Contexto = { articulos: ListaSeleccionable<Articulo> };

const setArticulos =
  (
    aplicable: (
      articulos: ListaSeleccionable<Articulo>
    ) => ListaSeleccionable<Articulo>
  ) =>
  (maquina: Maquina3<Estado, Contexto>) => ({
    ...maquina,
    contexto: {
      ...maquina.contexto,
      articulos: aplicable(maquina.contexto.articulos),
    },
  });

const configMaquina: ConfigMaquina4<Estado, Contexto> = {
  inicial: {
    estado: "inactivo",
    contexto: {
      articulos: listaSeleccionableVacia<Articulo>(),
    },
  },
  estados: {
    inactivo: {
      crear: "creando",
      articulo_cambiado: ({ maquina, payload }) =>
        pipe(maquina, setArticulos(cambiarItem(payload as Articulo))),
      articulo_seleccionado: ({ maquina, payload }) =>
        pipe(maquina, setArticulos(seleccionarItem(payload as Articulo))),
      articulo_borrado: ({ maquina }) => {
        const { articulos } = maquina.contexto;
        if (!articulos.idActivo) return maquina;
        return pipe(maquina, setArticulos(quitarItem(articulos.idActivo)));
      },
      articulos_cargados: ({ maquina, payload }) =>
        pipe(maquina, setArticulos(cargar(payload as Articulo[]))),
      borrar: "borrando",
      seleccion_cancelada: ({ maquina }) =>
        pipe(
          maquina,
          setArticulos((articulos) => ({
            ...articulos,
            idActivo: null,
          }))
        ),
    },
    creando: {
      articulo_creado: ({ maquina, payload, setEstado }) =>
        pipe(
          maquina,
          setEstado("inactivo"),
          setArticulos(incluirItem(payload as Articulo, {}))
        ),
      creacion_cancelada: "inactivo",
    },
    borrando: {
      borrado_cancelado: "inactivo",
      borrado_confirmado: "inactivo",
    },
  },
};

export const MaestroConDetalleArticulo = () => {
  const [emitir, { estado, contexto }] = useMaquina4({ config: configMaquina });
  const { articulos } = contexto;

  const setEntidades = useCallback(
    (payload: Articulo[]) => emitir("articulos_cargados", payload),
    [emitir]
  );
  const setSeleccionada = useCallback(
    (payload: Articulo) => emitir("articulo_seleccionado", payload),
    [emitir]
  );

  const seleccionada = getSeleccionada(articulos);

  return (
    <div className="Articulo">
      <MaestroDetalle<Articulo>
        seleccionada={seleccionada}
        preMaestro={
          <>
            <h2>Articulos</h2>
            <div className="maestro-botones">
              <QBoton onClick={() => emitir("crear")}>Nueva</QBoton>
            </div>
          </>
        }
        metaTabla={metaTablaArticulo}
        modoDisposicion="maestro-50"
        entidades={articulos.lista}
        setEntidades={setEntidades}
        setSeleccionada={setSeleccionada}
        cargar={getArticulos}
        Detalle={
          <DetalleArticulo
            key={seleccionada?.id}
            articuloInicial={seleccionada}
            publicar={emitir}
          />
        }
      />
      <CrearArticulo emitir={emitir} activo={estado === "creando"} />
    </div>
  );
};
