import { Criteria, Entidad } from "@olula/lib/diseño.ts";
import { criteriaDefecto } from "@olula/lib/dominio.js";
import { MetaTabla } from "../atomos/qtabla.tsx";
import { QTablaControlada } from "../atomos/qtablacontrolada.tsx";
import { QTarjetaGenerica } from "../atomos/qtarjeta_generica.tsx";
import { QTarjetas } from "../atomos/qtarjetas.tsx";
import { SinDatos } from "../SinDatos/SinDatos.tsx";
import "./Listado.css";
import {
  getMetaFiltroDefecto,
  MaestroFiltrosActivoControlado,
  MetaFiltro,
} from "./maestroFiltros/MaestroFiltrosActivoControlado.tsx";

const datosCargando = <T extends Entidad>() =>
  new Array(10).fill(null).map(
    (_, i) =>
      ({
        id: i.toString(),
        ...Object.fromEntries(
          new Array(10).fill(null).map((_, j) => [j, "U00A0"])
        ),
      }) as T
  );

type Modo = "tabla" | "tarjetas";

type ListadoProps<T extends Entidad> = {
  metaTabla?: MetaTabla<T>;
  metaFiltro?: MetaFiltro;
  cargando?: boolean;
  tarjeta?: (entidad: T) => React.ReactNode;
  criteriaInicial?: Criteria;
  criteria?: Criteria;
  entidades: T[];
  totalEntidades: number;
  seleccionada?: string;
  onSeleccion: (seleccionada: string) => void;
  modo?: Modo;
  onCriteriaChanged: (criteria: Criteria) => void;
  onSiguientePagina?: (criteria: Criteria) => void;
};

export const Listado = <T extends Entidad>({
  metaTabla,
  metaFiltro,
  cargando = false,
  criteriaInicial = criteriaDefecto,
  criteria = criteriaDefecto,
  tarjeta,
  entidades,
  totalEntidades,
  seleccionada,
  onSeleccion,
  modo = "tabla",
  onCriteriaChanged,
  onSiguientePagina,
}: ListadoProps<T>) => {
  const renderEntidades = () => {
    if (!entidades.length && !cargando) return <SinDatos />;

    const datos = entidades.length ? entidades : datosCargando<T>();

    if (modo == "tarjetas" && tarjeta) {
      return (
        <QTarjetas
          tarjeta={tarjeta}
          datos={datos}
          cargando={cargando}
          seleccionadaId={seleccionada}
          onSeleccion={(e: T) => onSeleccion(e.id)}
          onPaginacion={(pagina, limite) => {
            onCriteriaChanged({ ...criteria, paginacion: { pagina, limite } });
          }}
          totalEntidades={totalEntidades}
          criteria={criteria}
          onSiguientePagina={onSiguientePagina}
        />
      );
    }

    if (modo == "tarjetas" && metaTabla) {
      return (
        <QTarjetas
          tarjeta={(entidad: T) => (
            <QTarjetaGenerica entidad={entidad} metaTabla={metaTabla} />
          )}
          datos={datos}
          cargando={cargando}
          seleccionadaId={seleccionada}
          onSeleccion={(e: T) => onSeleccion(e.id)}
          onPaginacion={(pagina, limite) => {
            onCriteriaChanged({ ...criteria, paginacion: { pagina, limite } });
          }}
          totalEntidades={totalEntidades}
          criteria={criteria}
          onSiguientePagina={onSiguientePagina}
        />
      );
    }

    if (modo == "tabla" && metaTabla) {
      return (
        <QTablaControlada
          metaTabla={metaTabla}
          datos={datos}
          cargando={cargando}
          seleccionadaId={seleccionada}
          onSeleccion={(e: T) => onSeleccion(e.id)}
          orden={criteria.orden}
          onOrdenChanged={(orden) => {
            onCriteriaChanged({
              ...criteria,
              orden,
              paginacion: { ...criteria.paginacion, pagina: 1 },
            });
          }}
          paginacion={criteria.paginacion}
          onPaginacionChanged={(paginacion) => {
            onCriteriaChanged({
              ...criteria,
              paginacion,
            });
          }}
          totalEntidades={totalEntidades}
        />
      );
    }

    return null;
  };

  return (
    <div className="Listado">
      {/* {tarjeta && metaTabla && (
            <div className="cambio-modo">
            <span
                className="cambio-modo-icono"
                onClick={() =>
                    setModo && setModo(modo === "tabla" ? "tarjetas" : "tabla")
                }
            >
                <QIcono nombre={modo === "tabla" ? "lista" : "tabla"} tamaño="md" />
            </span>
            </div>
        )} */}
      <MaestroFiltrosActivoControlado
        metaFiltro={
          metaFiltro ?? getMetaFiltroDefecto(metaTabla as MetaTabla<T>)
        }
        filtro={criteria.filtro}
        filtroInicial={criteriaInicial.filtro}
        onFiltroChanged={(filtro) => {
          onCriteriaChanged({
            ...criteria,
            filtro,
            paginacion: { ...criteria.paginacion, pagina: 1 },
          });
        }}
      />
      {renderEntidades()}
    </div>
  );
};
