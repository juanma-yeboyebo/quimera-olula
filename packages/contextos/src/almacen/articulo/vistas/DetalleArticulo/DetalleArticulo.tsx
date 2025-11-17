import { Detalle } from "@olula/componentes/detalle/Detalle.tsx";
import { Tab, Tabs } from "@olula/componentes/detalle/tabs/Tabs.tsx";
import { QInput } from "@olula/componentes/index.js";
import { QBoton } from "@olula/componentes/index.ts";
import { ContextoError } from "@olula/lib/contexto.ts";
import { EmitirEvento, Entidad } from "@olula/lib/diseño.ts";
import { ConfigMaquina4, useMaquina4 } from "@olula/lib/useMaquina.ts";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useContext } from "react";
import { useParams } from "react-router";
import { Articulo } from "../../diseño";
import { articuloVacio, metaArticulo } from "../../dominio";
import { getArticulo, patchArticulo } from "../../infraestructura";
import { BorrarArticulo } from "./BorrarArticulo";

// Máquina de estados y contexto

type Estado = "editando" | "borrando";
type Contexto = Record<string, unknown>;

const configMaquina: ConfigMaquina4<Estado, Contexto> = {
  inicial: {
    estado: "editando",
    contexto: {},
  },
  estados: {
    editando: {
      borrar: "borrando",
      articulo_guardado: ({ publicar }) => publicar("articulo_cambiado"),
      cancelar_seleccion: ({ publicar }) => publicar("cancelar_seleccion"),
    },
    borrando: {
      borrado_cancelado: "editando",
      articulo_borrado: ({ publicar }) => publicar("articulo_borrado"),
    },
  },
};

const titulo = (articulo: Entidad) => articulo.descripcion as string;

export const DetalleArticulo = ({
  articuloInicial = null,
  publicar = () => {},
}: {
  articuloInicial?: Articulo | null;
  publicar?: EmitirEvento;
}) => {
  const params = useParams();
  const articuloId = articuloInicial?.id ?? params.id;
  const { intentar } = useContext(ContextoError);

  const articulo = useModelo(metaArticulo, articuloVacio);
  const { modelo, uiProps, init, modificado, valido } = articulo;

  const [emitir, { estado }] = useMaquina4<Estado, Contexto>({
    config: configMaquina,
    publicar: publicar,
  });

  const guardar = async () => {
    await intentar(() => patchArticulo(modelo.id, modelo));
    const articulo_guardado = await getArticulo(modelo.id);
    init(articulo_guardado);
    emitir("articulo_guardado", articulo_guardado);
  };

  return (
    <Detalle
      id={articuloId}
      obtenerTitulo={titulo}
      setEntidad={(m) => init(m)}
      entidad={modelo}
      cargar={getArticulo}
      cerrarDetalle={() => publicar("seleccion_cancelada")}
    >
      {!!articuloId && (
        <div className="DetalleArticulo">
          <div className="maestro-botones ">
            <QBoton onClick={() => emitir("borrar")}>Borrar</QBoton>
          </div>
          <Tabs
            children={[
              <Tab
                key="tab-1"
                label="Datos"
                children={
                  <>
                    <quimera-formulario>
                      <QInput label="Descripción" {...uiProps("descripcion")} />
                    </quimera-formulario>
                  </>
                }
              />,
              //   <Tab
              //     key="tab-2"
              //     label="Observaciones"
              //     children={<TabObservaciones oportunidad={oportunidad} />}
              //   />,
            ]}
          ></Tabs>

          {modificado && (
            <div className="botones maestro-botones">
              <QBoton onClick={guardar} deshabilitado={!valido}>
                Guardar
              </QBoton>
              <QBoton tipo="reset" variante="texto" onClick={() => init()}>
                Cancelar
              </QBoton>
            </div>
          )}
          <BorrarArticulo
            publicar={emitir}
            activo={estado === "borrando"}
            articulo={modelo}
          />
        </div>
      )}
    </Detalle>
  );
};
