import { Criteria, Entidad } from "@olula/lib/diseño.ts";
import { criteriaDefecto } from "@olula/lib/dominio.js";
import { useCallback, useEffect, useState } from "react";
import { QIcono } from "../atomos/qicono.tsx";
import { MetaTabla } from "../atomos/qtabla.tsx";
import { QTablaControlada } from "../atomos/qtablacontrolada.tsx";
import { QTarjetaGenerica } from "../atomos/qtarjeta_generica.tsx";
import { QTarjetas } from "../atomos/qtarjetas.tsx";
import { expandirEntidad } from "../detalle/helpers.tsx";
import { SinDatos } from "../SinDatos/SinDatos.tsx";
import "./Listado.css";
import { filtrarEntidad } from "./maestroFiltros/filtro.ts";
import { MaestroFiltrosControlado } from "./maestroFiltros/MaestroFiltrosControlado.tsx";

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
  renderAcciones?: () => React.ReactNode;
  idReiniciarCriteria?: string;
  criteriaInicial: Criteria;
  entidades: T[];
  totalEntidades: number;
  seleccionada: T | null;
  onSeleccion: (seleccionada: T) => void;
  modo?: Modo;
  onModoChanged?: (modo: Modo) => void;
  onCriteriaChanged: (criteria: Criteria) => void;
};

export const ListadoSemiControlado = <T extends Entidad>({
  metaTabla,
  metaFiltro = false, // TODO: Pasar una estructura que defina el filtro y no mostrar filtro si es undefined
  cargando = false,
  idReiniciarCriteria,
  criteriaInicial = criteriaDefecto,
  tarjeta,
  renderAcciones,
  entidades,
  totalEntidades,
  seleccionada,
  onSeleccion,
  modo,
  onModoChanged,
  onCriteriaChanged,
}: MaestroProps<T>) => {
  const [criteria, setCriteria] = useState<Criteria>(criteriaInicial);
  const [modoEstado, setModoEstado] = useState<Modo>(modo ?? "tabla");
  const modoInterno = modo ?? modoEstado;

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
  const mostrarCabecera = metaFiltro || mostrarCambioModo || Boolean(acciones);

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
        totalEntidades={totalEntidades}
        criteria={criteria}
      />
    );
  };

  const renderEntidades = () => {
    if (!entidadesFiltradas.length && !cargando) return <SinDatos />;

    const datos = entidadesFiltradas.length
      ? entidadesFiltradas
      : datosCargando<T>();

    if (modoEfectivo === "tarjetas") {
      if (tarjeta) return renderTarjetas(datos, tarjeta);
      if (tarjetaGenerica) return renderTarjetas(datos, tarjetaGenerica);
    }

    if (modoEfectivo === "tabla" && metaTabla) {
      return renderTabla(datos);
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
      {mostrarCabecera && (
        <div className="listado-cabecera">
          <div className="listado-cabecera-izquierda">
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
      )}
      {renderEntidades()}
    </div>
  );
};
