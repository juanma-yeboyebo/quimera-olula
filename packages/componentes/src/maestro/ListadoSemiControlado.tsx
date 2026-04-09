import { Criteria, Entidad } from "@olula/lib/diseño.ts";
import { criteriaDefecto } from "@olula/lib/dominio.js";
import { useCallback, useEffect, useState } from "react";
import { MetaTabla } from "../atomos/qtabla.tsx";
import { QTablaControlada } from "../atomos/qtablacontrolada.tsx";
import { QTarjetaGenerica } from "../atomos/qtarjeta_generica.tsx";
import { QTarjetas } from "../atomos/qtarjetas.tsx";
import { expandirEntidad } from "../detalle/helpers.tsx";
import { SinDatos } from "../SinDatos/SinDatos.tsx";
import "./Listado.css";
import { filtrarEntidad } from "./maestroFiltros/filtro.ts";
import { MaestroFiltrosControlado } from "./maestroFiltros/MaestroFiltrosControlado.tsx";
import { useEsMovil } from "./useEsMovil.ts";

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

const obtenerCampos = (entidad: Entidad | null): string[] => {
  if (!entidad) return [];
  return expandirEntidad(entidad).map(([clave]) => clave);
};

type Modo = "tabla" | "tarjetas";

type MaestroProps<T extends Entidad> = {
  metaTabla?: MetaTabla<T>;
  metaFiltro?: boolean;
  cargando?: boolean;
  tarjeta?: (entidad: T) => React.ReactNode;
  idReiniciarCriteria?: string;
  criteriaInicial: Criteria;
  entidades: T[];
  totalEntidades: number;
  seleccionada: T | null;
  onSeleccion: (seleccionada: T) => void;
  modo?: Modo;
  onCriteriaChanged: (criteria: Criteria) => void;
};

export const ListadoSemiControlado = <T extends Entidad>({
  metaTabla,
  metaFiltro = false, // TODO: Pasar una estructura que defina el filtro y no mostrar filtro si es undefined
  cargando = false,
  idReiniciarCriteria,
  criteriaInicial = criteriaDefecto,
  tarjeta,
  entidades,
  totalEntidades,
  seleccionada,
  onSeleccion,
  modo,
  onCriteriaChanged,
}: MaestroProps<T>) => {
  const [criteria, setCriteria] = useState<Criteria>(criteriaInicial);
  const esMovil = useEsMovil();

  const cambiarCriteria = useCallback(
    (c: Criteria) => {
      setCriteria(c);
      onCriteriaChanged(c);
    },
    [setCriteria, onCriteriaChanged]
  );

  const entidadesFiltradas = entidades.filter((entidad) =>
    filtrarEntidad(entidad, criteria.filtro)
  );

  const tarjetaGenerica =
    metaTabla !== undefined
      ? (entidad: T) => (
          <QTarjetaGenerica entidad={entidad} metaTabla={metaTabla} />
        )
      : undefined;

  const renderTabla = (datos: T[]) => {
    if (!metaTabla) return null;

    return (
      <QTablaControlada
        metaTabla={metaTabla}
        datos={datos}
        cargando={cargando}
        seleccionadaId={seleccionada?.id}
        onSeleccion={onSeleccion}
        orden={criteria.orden}
        onOrdenChanged={(orden) => {
          cambiarCriteria({
            ...criteria,
            orden,
            paginacion: { ...criteria.paginacion, pagina: 1 },
          });
        }}
        paginacion={criteria.paginacion}
        onPaginacionChanged={(paginacion) => {
          cambiarCriteria({
            ...criteria,
            paginacion,
          });
        }}
        totalEntidades={totalEntidades}
      />
    );
  };

  const renderTarjetas = (
    datos: T[],
    tarjetaRender: (entidad: T) => React.ReactNode
  ) => {
    return (
      <QTarjetas
        tarjeta={tarjetaRender}
        datos={datos}
        cargando={cargando}
        seleccionadaId={seleccionada?.id}
        onSeleccion={onSeleccion}
        onPaginacion={(pagina, limite) => {
          cambiarCriteria({ ...criteria, paginacion: { pagina, limite } });
        }}
        totalEntidades={entidades.length}
        criteria={criteria}
      />
    );
  };

  const renderEntidades = () => {
    if (!entidadesFiltradas.length && !cargando) return <SinDatos />;

    const datos = entidadesFiltradas.length
      ? entidadesFiltradas
      : datosCargando<T>();

    if (modo === "tabla" && metaTabla) {
      return renderTabla(datos);
    }

    if (modo === "tarjetas" && tarjeta) {
      return renderTarjetas(datos, tarjeta);
    }

    if (!modo && esMovil && tarjetaGenerica) {
      return renderTarjetas(datos, tarjetaGenerica);
    }

    return null;
  };

  useEffect(() => {
    if (idReiniciarCriteria) {
      setCriteria(criteriaInicial);
    }
  }, [idReiniciarCriteria, criteriaInicial, setCriteria]);

  return (
    <div className="Listado">
      {metaFiltro && (
        <MaestroFiltrosControlado
          campos={obtenerCampos(entidades[0])}
          filtro={criteria.filtro}
          filtroInicial={criteriaInicial.filtro}
          onFiltroChanged={(filtro) => {
            cambiarCriteria({
              ...criteria,
              filtro,
            });
          }}
        />
      )}
      {renderEntidades()}
    </div>
  );
};
