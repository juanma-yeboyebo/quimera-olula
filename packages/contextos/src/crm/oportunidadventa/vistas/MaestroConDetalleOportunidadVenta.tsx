import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { MaestroDetalle } from "@olula/componentes/maestro/MaestroDetalle.tsx";
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
import { CrearOportunidadVenta } from "../crear/CrearOportunidadVenta.tsx";
import { OportunidadVenta } from "../diseño.ts";
import { getOportunidadesVenta } from "../infraestructura.ts";
import { metaTablaOportunidadVenta } from "../maestro/maestro.ts";
import { DetalleOportunidadVenta } from "./DetalleOportunidadVenta/DetalleOportunidadVenta.tsx";
import { TarjetaOportunidadVenta } from "./TarjetaOportunidadVenta.tsx";
// import "./MaestroConDetalleOportunidadVenta.css";

type Estado = "inactivo" | "creando";
type Contexto = {
  oportunidades: ListaSeleccionable<OportunidadVenta>;
};

const setOportunidades =
  (
    aplicable: (
      oportunidades: ListaSeleccionable<OportunidadVenta>
    ) => ListaSeleccionable<OportunidadVenta>
  ) =>
  (maquina: Maquina3<Estado, Contexto>) => {
    return {
      ...maquina,
      contexto: {
        ...maquina.contexto,
        oportunidades: aplicable(maquina.contexto.oportunidades),
      },
    };
  };

const configMaquina: ConfigMaquina4<Estado, Contexto> = {
  inicial: {
    estado: "inactivo",
    contexto: {
      oportunidades: listaSeleccionableVacia<OportunidadVenta>(),
    },
  },
  estados: {
    inactivo: {
      crear: "creando",
      oportunidad_cambiada: ({ maquina, payload }) =>
        pipe(
          maquina,
          setOportunidades(cambiarItem(payload as OportunidadVenta))
        ),
      oportunidad_seleccionada: ({ maquina, payload }) =>
        pipe(
          maquina,
          setOportunidades(seleccionarItem(payload as OportunidadVenta))
        ),
      oportunidad_borrada: ({ maquina }) => {
        const { oportunidades } = maquina.contexto;
        if (!oportunidades.idActivo) {
          return maquina;
        }
        return pipe(
          maquina,
          setOportunidades(quitarItem(oportunidades.idActivo))
        );
      },
      oportunidades_cargadas: ({ maquina, payload, setEstado }) =>
        pipe(
          maquina,
          setEstado("inactivo" as Estado),
          setOportunidades(cargar(payload as OportunidadVenta[]))
        ),
      seleccion_cancelada: ({ maquina }) =>
        pipe(
          maquina,
          setOportunidades((oportunidades) => ({
            ...oportunidades,
            idActivo: null,
          }))
        ),
    },
    creando: {
      oportunidad_creada: ({ maquina, payload, setEstado }) =>
        pipe(
          maquina,
          setEstado("inactivo" as Estado),
          setOportunidades(incluirItem(payload as OportunidadVenta, {}))
        ),
      creacion_cancelada: "inactivo",
    },
  },
};

export const MaestroConDetalleOportunidadVenta = () => {
  const [emitir, { estado, contexto }] = useMaquina4<Estado, Contexto>({
    config: configMaquina,
  });
  const { oportunidades } = contexto;

  const setEntidades = useCallback(
    (payload: OportunidadVenta[]) => emitir("oportunidades_cargadas", payload),
    [emitir]
  );
  const setSeleccionada = useCallback(
    (payload: OportunidadVenta) => emitir("oportunidad_seleccionada", payload),
    [emitir]
  );

  const seleccionada = getSeleccionada(oportunidades);

  return (
    <div className="OportunidadVenta">
      <MaestroDetalle<OportunidadVenta>
        seleccionada={seleccionada}
        preMaestro={
          <>
            <h2>Oportunidades de Venta</h2>
            <div className="maestro-botones">
              <QBoton onClick={() => emitir("crear")}>Nueva</QBoton>
            </div>
          </>
        }
        modoVisualizacion="tabla"
        metaTabla={metaTablaOportunidadVenta}
        tarjeta={(oportunidad) => (
          <TarjetaOportunidadVenta oportunidad={oportunidad} />
        )}
        entidades={oportunidades.lista}
        setEntidades={setEntidades}
        setSeleccionada={setSeleccionada}
        cargar={getOportunidadesVenta}
        Detalle={
          <DetalleOportunidadVenta
            oportunidadInicial={seleccionada}
            publicar={emitir}
          />
        }
      />
      {estado === "creando" && <CrearOportunidadVenta publicar={emitir} />}
    </div>
  );
};
