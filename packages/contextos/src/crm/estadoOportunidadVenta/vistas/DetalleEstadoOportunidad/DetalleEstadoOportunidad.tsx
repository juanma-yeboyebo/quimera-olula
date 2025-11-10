import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { Detalle } from "@olula/componentes/detalle/Detalle.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { EmitirEvento, Entidad } from "@olula/lib/diseño.ts";
import { ConfigMaquina4, useMaquina4 } from "@olula/lib/useMaquina.ts";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useContext } from "react";
import { useParams } from "react-router";
import { EstadoOportunidad } from "../../diseño.ts";
import {
  estadoOportunidadVacio,
  metaEstadoOportunidad,
} from "../../dominio.ts";
import {
  getEstadoOportunidad,
  patchEstadoOportunidad,
} from "../../infraestructura.ts";
import { BorrarEstadoOportunidad } from "./BorrarEstadoOportunidad.tsx";
import "./DetalleEstadoOportunidad.css";

type Estado = "Edicion" | "Borrando";
type Contexto = Record<string, unknown>;

const configMaquina: ConfigMaquina4<Estado, Contexto> = {
  inicial: {
    estado: "Edicion",
    contexto: {},
  },
  estados: {
    Edicion: {
      borrar: "Borrando",
      estado_oportunidad_guardado: ({ publicar }) =>
        publicar("estado_oportunidad_cambiado"),
      cancelar_seleccion: ({ publicar }) => publicar("cancelar_seleccion"),
    },
    Borrando: {
      borrado_cancelado: "Edicion",
      estado_oportunidad_borrado: ({ publicar }) =>
        publicar("estado_oportunidad_borrado"),
    },
  },
};

export const DetalleEstadoOportunidad = ({
  estadoInicial = null,
  publicar = () => {},
}: {
  estadoInicial?: EstadoOportunidad | null;
  publicar?: EmitirEvento;
}) => {
  const params = useParams();
  const estadoId = estadoInicial?.id ?? params.id;
  const titulo = (estado: Entidad) => estado.descripcion as string;
  const { intentar } = useContext(ContextoError);

  const estadoOportunidad = useModelo(
    metaEstadoOportunidad,
    estadoOportunidadVacio
  );
  const { modelo, init, modificado, valido } = estadoOportunidad;

  const [emitir, { estado }] = useMaquina4<Estado, Contexto>({
    config: configMaquina,
    publicar: publicar,
  });

  const onGuardarClicked = async () => {
    await intentar(() => patchEstadoOportunidad(modelo.id, modelo));
    const estado_guardado = await getEstadoOportunidad(modelo.id);
    init(estado_guardado);
    emitir("estado_oportunidad_guardado", estado_guardado);
  };

  return (
    <Detalle
      id={estadoId}
      obtenerTitulo={titulo}
      setEntidad={(e) => init(e)}
      entidad={modelo}
      cargar={getEstadoOportunidad}
      cerrarDetalle={() => publicar("seleccion_cancelada")}
    >
      {!!estadoId && (
        <>
          <div className="maestro-botones ">
            <QBoton onClick={() => emitir("borrar")}>Borrar</QBoton>
          </div>
          <div className="DetalleEstadoOportunidad">
            <quimera-formulario>
              <QInput
                label="Descripción"
                {...estadoOportunidad.uiProps("descripcion")}
              />
              <QInput
                label="Probabilidad (%)"
                {...estadoOportunidad.uiProps("probabilidad")}
              />
              <QInput
                label="Valor por defecto"
                {...estadoOportunidad.uiProps("valor_defecto")}
              />
            </quimera-formulario>
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
          </div>
        </>
      )}
      <BorrarEstadoOportunidad
        publicar={publicar}
        activo={estado === "Borrando"}
        EstadoOportunidad={modelo}
      />
    </Detalle>
  );
};
