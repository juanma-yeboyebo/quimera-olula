import { Criteria, Entidad, Paginacion } from "@olula/lib/diseño.ts";
import { calcularPaginacionSimplificada } from "@olula/lib/dominio.ts";
import { ReactNode } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { QBoton } from "./qboton.tsx";
import "./qtabla.css";
import "./qtarjetas.css";

const paginacionControlador = (
  totalEntidades: number | undefined,
  paginacion: Paginacion,
  onPaginacion?: (pagina: number, limite: number) => void
) => {
  if (!onPaginacion || totalEntidades === undefined || totalEntidades <= 0) {
    return null;
  }
  const { pagina, limite } = paginacion;
  if (limite >= totalEntidades) {
    return null;
  }
  const { paginasMostradas, totalPaginas } = calcularPaginacionSimplificada(
    totalEntidades,
    pagina,
    limite
  );

  return (
    <quimera-tabla-paginacion>
      <QBoton
        deshabilitado={pagina === 1 || totalPaginas === 0}
        tamaño="pequeño"
        variante="texto"
        onClick={() => onPaginacion?.(1, limite)}
      >
        &lt;&lt;
      </QBoton>

      <QBoton
        deshabilitado={pagina === 1 || totalPaginas === 0}
        tamaño="pequeño"
        variante="texto"
        onClick={() => onPaginacion?.(Math.max(1, pagina - 1), limite)}
      >
        &lt;
      </QBoton>

      {paginasMostradas.map((numPagina) => (
        <QBoton
          key={numPagina}
          tamaño="pequeño"
          deshabilitado={numPagina === pagina}
          variante={numPagina === pagina ? "borde" : "texto"}
          onClick={() => onPaginacion?.(numPagina, limite)}
        >
          {numPagina}
        </QBoton>
      ))}

      <QBoton
        deshabilitado={pagina >= totalPaginas || totalPaginas === 0}
        tamaño="pequeño"
        variante="texto"
        onClick={() =>
          onPaginacion?.(Math.min(totalPaginas, pagina + 1), limite)
        }
      >
        &gt;
      </QBoton>

      <QBoton
        deshabilitado={pagina >= totalPaginas || totalPaginas === 0}
        tamaño="pequeño"
        variante="texto"
        onClick={() => onPaginacion?.(totalPaginas, limite)}
      >
        &gt;&gt;
      </QBoton>
    </quimera-tabla-paginacion>
  );
};

export type QTarjetasProps<T extends Entidad> = {
  tarjeta: (entidad: T) => ReactNode;
  datos: T[];
  cargando: boolean;
  seleccionadaId?: string;
  onSeleccion?: (entidad: T) => void;
  // orden: Orden;
  onOrdenar?: (clave: string) => void;
  // paginacion?: Paginacion;
  onPaginacion?: (pagina: number, limite: number) => void;
  totalEntidades?: number;
  criteria: Criteria;
  onSiguientePagina?: (criteria: Criteria) => void;
};

export const QTarjetas = <T extends Entidad>({
  tarjeta,
  datos,
  cargando,
  seleccionadaId,
  onSeleccion,
  // paginacion,
  onPaginacion,
  totalEntidades = 0,
  criteria,
  onSiguientePagina,
}: QTarjetasProps<T>) => {
  const tarjetaItems = datos.map((entidad) => (
    <quimera-tarjeta
      key={entidad.id}
      className={entidad.id === seleccionadaId ? "seleccionada" : ""}
      onClick={() => onSeleccion && onSeleccion(entidad)}
    >
      {tarjeta(entidad)}
    </quimera-tarjeta>
  ));

  const renderLista = () => {
    if (onSiguientePagina && criteria) {
      return (
        <div className="lista-contenedor-scroll">
          <InfiniteScroll
            dataLength={datos.length}
            next={() =>
              onSiguientePagina({
                ...criteria,
                paginacion: {
                  ...criteria.paginacion,
                  pagina: criteria.paginacion.pagina + 1,
                },
              })
            }
            hasMore={datos.length < totalEntidades}
            loader={<div className="cargando">Cargando...</div>}
            height="64vh"
          >
            {tarjetaItems}
          </InfiniteScroll>
        </div>
      );
    }

    return <div className="lista-contenedor-scroll">{tarjetaItems}</div>;
  };

  return (
    <quimera-tarjetas>
      {cargando ? (
        <div className="cargando">Cargando...</div>
      ) : datos.length === 0 ? (
        <div className="no-datos">No hay datos</div>
      ) : (
        renderLista()
      )}
      {!onSiguientePagina &&
        paginacionControlador(
          totalEntidades,
          criteria.paginacion!,
          onPaginacion
        )}
    </quimera-tarjetas>
  );
};
