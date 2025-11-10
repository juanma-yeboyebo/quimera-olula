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
import { Usuario } from "../diseño.ts";
import { metaTablaUsuario } from "../dominio.ts";
import { getUsuarios } from "../infraestructura.ts";
import { CrearUsuario } from "./CrearUsuario";
import { DetalleUsuario } from "./DetalleUsuario/DetalleUsuario";

type Estado = "inactivo" | "creando" | "borrando";
type Contexto = { usuarios: ListaSeleccionable<Usuario> };

const setUsuarios =
  (
    aplicable: (
      usuarios: ListaSeleccionable<Usuario>
    ) => ListaSeleccionable<Usuario>
  ) =>
  (maquina: Maquina3<Estado, Contexto>) => ({
    ...maquina,
    contexto: {
      ...maquina.contexto,
      usuarios: aplicable(maquina.contexto.usuarios),
    },
  });

const configMaquina: ConfigMaquina4<Estado, Contexto> = {
  inicial: {
    estado: "inactivo",
    contexto: {
      usuarios: listaSeleccionableVacia<Usuario>(),
    },
  },
  estados: {
    inactivo: {
      crear: "creando",
      usuario_cambiado: ({ maquina, payload }) =>
        pipe(maquina, setUsuarios(cambiarItem(payload as Usuario))),
      usuario_seleccionado: ({ maquina, payload }) =>
        pipe(maquina, setUsuarios(seleccionarItem(payload as Usuario))),
      usuario_borrado: ({ maquina }) => {
        const { usuarios } = maquina.contexto;
        if (!usuarios.idActivo) return maquina;
        return pipe(maquina, setUsuarios(quitarItem(usuarios.idActivo)));
      },
      usuarios_cargados: ({ maquina, payload }) =>
        pipe(maquina, setUsuarios(cargar(payload as Usuario[]))),
      borrar: "borrando",
      seleccion_cancelada: ({ maquina }) =>
        pipe(
          maquina,
          setUsuarios((usuarios) => ({
            ...usuarios,
            idActivo: null,
          }))
        ),
    },
    creando: {
      usuario_creado: ({ maquina, payload, setEstado }) =>
        pipe(
          maquina,
          setEstado("inactivo"),
          setUsuarios(incluirItem(payload as Usuario, {}))
        ),
      creacion_cancelada: "inactivo",
    },
    borrando: {
      borrado_cancelado: "inactivo",
      borrado_confirmado: "inactivo",
    },
  },
};

export const MaestroConDetalleUsuario = () => {
  const [emitir, { estado, contexto }] = useMaquina4({ config: configMaquina });
  const { usuarios } = contexto;

  const setEntidades = useCallback(
    (payload: Usuario[]) => emitir("usuarios_cargados", payload),
    [emitir]
  );
  const setSeleccionada = useCallback(
    (payload: Usuario) => emitir("usuario_seleccionado", payload),
    [emitir]
  );

  const seleccionada = getSeleccionada(usuarios);

  return (
    <div className="Usuario">
      <MaestroDetalle<Usuario>
        seleccionada={seleccionada}
        preMaestro={
          <>
            <h2>Módulos</h2>
            <div className="maestro-botones">
              <QBoton onClick={() => emitir("crear")}>Nuevo</QBoton>
            </div>
          </>
        }
        modoVisualizacion="tabla"
        modoDisposicion="maestro-50"
        metaTabla={metaTablaUsuario}
        entidades={usuarios.lista}
        setEntidades={setEntidades}
        setSeleccionada={setSeleccionada}
        cargar={getUsuarios}
        Detalle={
          <DetalleUsuario usuarioInicial={seleccionada} emitir={emitir} />
        }
      />
      <CrearUsuario emitir={emitir} activo={estado === "creando"} />
    </div>
  );
};
