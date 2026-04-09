import { Entidad, Orden, Paginacion } from "@olula/lib/diseño.ts";
import {
  calcularPaginacionSimplificada,
  formatearFechaDate,
  formatearFechaHora,
  formatearFechaString,
  formatearHoraString,
  formatearMoneda,
} from "@olula/lib/dominio.ts";
import { ReactNode } from "react";
import { QBoton } from "./qboton.tsx";
import "./qtabla.css";

type TipoColumna =
  | "texto"
  | "numero"
  | "moneda"
  | "fecha"
  | "hora"
  | "fechahora"
  | "booleano";
type MetaColumna<T extends Entidad> = {
  id: string;
  cabecera: string;
  prioridad?: "alta" | "media" | "baja";
  esTitulo?: boolean;
  tipo?: TipoColumna;
  divisa?: string;
  ancho?: string; // Ancho específico para esta columna
  render?: (entidad: T) => string | ReactNode;
};

export type MetaTabla<T extends Entidad> = MetaColumna<T>[];

const cabecera = <T extends Entidad>(
  metaTabla: MetaTabla<T>,
  orden: Orden,
  onOrdenChanged?: (orden: Orden) => void
) => {
  const [colOrdenada, sentido] = orden;

  const renderCabecera = ({ id, cabecera, tipo, ancho }: MetaColumna<T>) => (
    <th
      key={id}
      data-modo="columna"
      data-orden={id === colOrdenada ? sentido : ""}
      className={`${id} ${tipo ?? ""}`}
      style={ancho ? { width: ancho } : undefined}
      onClick={() =>
        onOrdenChanged &&
        onOrdenChanged([
          id,
          colOrdenada == id ? (sentido == "ASC" ? "DESC" : "ASC") : "ASC",
        ])
      }
    >
      {cabecera}
    </th>
  );

  return metaTabla.map(renderCabecera);
};

const a_string = (
  valor: unknown,
  tipo?: TipoColumna,
  divisa?: string
): string => {
  let formateado = "";

  // console.log("valor", valor, "tipo", typeof valor);

  if (tipo === "moneda" && typeof valor === "number") {
    formateado = formatearMoneda(valor, divisa ?? "EUR");
  } else if (tipo === "fecha" && typeof valor === "string") {
    formateado = formatearFechaString(valor);
  } else if (tipo === "fecha" && typeof valor === "object") {
    formateado = formatearFechaDate(valor as Date);
  } else if (tipo === "hora" && typeof valor === "string") {
    formateado = formatearHoraString(valor);
  } else if (tipo === "numero" && typeof valor === "number") {
    formateado = valor.toLocaleString();
  } else if (typeof valor === "boolean") {
    formateado = valor ? "Sí" : "No";
  } else if (tipo === "fechahora" && typeof valor === "object") {
    formateado = formatearFechaHora(valor as Date);
  } else if (typeof valor === "string") {
    formateado = valor;
  } else if (typeof valor === "number") {
    formateado = valor.toString();
  } else if (typeof valor === "undefined" || valor === null) {
    formateado = "";
  } else {
    throw new Error(`Tipo de dato desconocido: ${tipo} para valor ${valor}`);
  }

  return formateado;
};

const fila = <T extends Entidad>(
  entidad: Entidad,
  metaTabla: MetaTabla<T>,
  cargando: boolean
) => {
  const renderColumna = ({
    id,
    render,
    tipo,
    divisa,
    ancho,
  }: MetaColumna<T>) => {
    const valorCelda =
      cargando && typeof entidad[id] == "string"
        ? (entidad[id] as string)
        : (render?.(entidad as T) ??
          a_string(entidad[id] as string, tipo, divisa));

    return (
      <td
        key={[entidad.id, id].join("-")}
        className={`${id} ${tipo ?? ""}`}
        style={ancho ? { width: ancho } : undefined}
      >
        {valorCelda}
      </td>
    );
  };

  return metaTabla.map(renderColumna);
};

type PaginaSeleccionada = number | "<" | ">" | "<<" | ">>";

const Paginador = (
  totalEntidades: number | undefined,
  paginacion: Paginacion,
  onPaginacionChanged?: (paginacion: Paginacion) => void
) => {
  if (
    !onPaginacionChanged ||
    totalEntidades === undefined ||
    totalEntidades <= 0
  ) {
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

  const handlePaginacion = (numPagina: PaginaSeleccionada) => {
    if (!onPaginacionChanged) {
      return;
    }

    const getNumPagina = (numPagina: PaginaSeleccionada) => {
      if (numPagina == "<<") {
        return 1;
      }
      if (numPagina == "<") {
        return Math.max(1, pagina - 1);
      }
      if (numPagina == ">") {
        return Math.min(totalPaginas, pagina + 1);
      }
      if (numPagina == ">>") {
        return totalPaginas;
      }
      return numPagina;
    };
    onPaginacionChanged({
      pagina: getNumPagina(numPagina),
      limite,
    });
  };

  return (
    <quimera-tabla-paginacion>
      <QBoton
        deshabilitado={pagina === 1 || totalPaginas === 0}
        tamaño="pequeño"
        variante="texto"
        onClick={() => handlePaginacion("<<")}
      >
        &lt;&lt;
      </QBoton>

      <QBoton
        deshabilitado={pagina === 1 || totalPaginas === 0}
        tamaño="pequeño"
        variante="texto"
        onClick={() => handlePaginacion("<")}
      >
        &lt;
      </QBoton>

      {paginasMostradas.map((numPagina) => (
        <QBoton
          key={numPagina}
          tamaño="pequeño"
          deshabilitado={numPagina === pagina}
          variante={numPagina === pagina ? "borde" : "texto"}
          onClick={() => handlePaginacion(numPagina)}
        >
          {numPagina}
        </QBoton>
      ))}

      <QBoton
        deshabilitado={pagina >= totalPaginas || totalPaginas === 0}
        tamaño="pequeño"
        variante="texto"
        onClick={() => handlePaginacion(">")}
      >
        &gt;
      </QBoton>

      <QBoton
        deshabilitado={pagina >= totalPaginas || totalPaginas === 0}
        tamaño="pequeño"
        variante="texto"
        onClick={() => handlePaginacion(">>")}
      >
        &gt;&gt;
      </QBoton>
    </quimera-tabla-paginacion>
  );
};

export type QTablaProps<T extends Entidad> = {
  metaTabla: MetaTabla<T>;
  datos: T[];
  cargando: boolean;
  seleccionadaId?: string;
  onSeleccion?: (entidad: T) => void;
  orden: Orden;
  onOrdenChanged?: (orden: Orden) => void;
  paginacion?: Paginacion;
  onPaginacionChanged?: (paginacion: Paginacion) => void;
  totalEntidades?: number;
};

export const QTablaControlada = <T extends Entidad>({
  metaTabla,
  datos,
  cargando,
  seleccionadaId,
  onSeleccion,
  orden,
  onOrdenChanged,
  paginacion,
  onPaginacionChanged,
  totalEntidades = 0,
}: QTablaProps<T>) => {
  // Detectar si hay anchos específicos
  const tieneAnchosFijos = metaTabla.some((col) => col.ancho);

  // Completar columnas sin ancho
  const metaTablaCompleta = tieneAnchosFijos
    ? metaTabla.map((col) => {
        if (col.ancho) return col;

        const hayPorcentajes = metaTabla.some((c) => c.ancho?.includes("%"));
        const anchos = hayPorcentajes
          ? {
              texto: "20%",
              fecha: "10%",
              hora: "8%",
              moneda: "12%",
              numero: "10%",
              booleano: "8%",
              defecto: "15%",
            }
          : {
              texto: "150px",
              fecha: "90px",
              hora: "80px",
              moneda: "120px",
              numero: "100px",
              booleano: "100px",
              defecto: "150px",
            };

        return {
          ...col,
          ancho: anchos[col.tipo as keyof typeof anchos] || anchos.defecto,
        };
      })
    : metaTabla;

  return (
    <quimera-tabla>
      <div className="tabla-contenedor-scroll">
        <table data-anchos-fijos={tieneAnchosFijos}>
          <thead>
            <tr>{cabecera(metaTablaCompleta, orden, onOrdenChanged)}</tr>
          </thead>
          <tbody data-cargando={cargando}>
            {datos.map((entidad: T) => (
              <tr
                key={entidad.id}
                onClick={() => onSeleccion && onSeleccion(entidad)}
                data-seleccionada={entidad.id === seleccionadaId}
              >
                {fila(entidad, metaTablaCompleta, cargando)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {paginacion && Paginador(totalEntidades, paginacion, onPaginacionChanged)}
    </quimera-tabla>
  );
};
