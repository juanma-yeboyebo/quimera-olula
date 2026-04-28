import { Criteria, Entidad } from "@olula/lib/diseño.ts";
import { criteriaDefecto } from "@olula/lib/dominio.js";
import { useState } from "react";
import { QIcono } from "../atomos/qicono.tsx";
import { MetaTabla } from "../atomos/qtabla.tsx";
import { QTablaControlada } from "../atomos/qtablacontrolada.tsx";
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
  renderAcciones?: () => React.ReactNode;
  criteriaInicial?: Criteria;
  criteria?: Criteria;
  entidades: T[];
  totalEntidades: number;
  seleccionada?: string;
  onSeleccion: (seleccionada: string) => void;
  modo?: Modo;
  onModoChanged?: (modo: Modo) => void;
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
  renderAcciones,
  entidades,
  totalEntidades,
  seleccionada,
  onSeleccion,
  modo,
  onModoChanged,
  onCriteriaChanged,
  onSiguientePagina,
}: ListadoProps<T>) => {
  const [modoEstado, setModoEstado] = useState<Modo>(modo ?? "tabla");
  const modoInterno = modo ?? modoEstado;

  const puedeTabla = metaTabla !== undefined;
  const puedeTarjetas = tarjeta !== undefined;

  const modoEfectivo =
    modoInterno === "tabla" && puedeTabla
      ? "tabla"
      : modoInterno === "tarjetas" && puedeTarjetas
        ? "tarjetas"
        : puedeTabla
          ? "tabla"
          : puedeTarjetas
            ? "tarjetas"
            : null;

  const cambiarModo = (nuevoModo: Modo) => {
    if (modo === undefined) setModoEstado(nuevoModo);
    onModoChanged?.(nuevoModo);
  };

  const mostrarCambioModo = puedeTabla && puedeTarjetas && modoEfectivo;
  // const mostrarCambioModo = false;
  const acciones = renderAcciones?.();

  const renderEntidades = () => {
    if (!entidades.length && !cargando) return <SinDatos />;

    const datos = entidades.length ? entidades : datosCargando<T>();

    if (modoEfectivo === "tarjetas") {
      if (!tarjeta) return null;

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

    if (modoEfectivo === "tabla" && metaTabla) {
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
      <div className="listado-cabecera">
        <div className="listado-cabecera-izquierda">
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
        </div>

        <div className="listado-cabecera-derecha">
          {acciones}
          {mostrarCambioModo && (
            <div className="cambio-modo">
              <span
                className="cambio-modo-icono"
                onClick={() =>
                  cambiarModo(modoEfectivo === "tabla" ? "tarjetas" : "tabla")
                }
              >
                <QIcono
                  nombre={modoEfectivo === "tabla" ? "lista" : "tabla"}
                  tamaño="md"
                />
              </span>
            </div>
          )}
        </div>
      </div>
      {renderEntidades()}
    </div>
  );
};
