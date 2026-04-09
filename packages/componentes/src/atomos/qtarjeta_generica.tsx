import { Entidad } from "@olula/lib/diseño.ts";
import {
  formatearFechaDate,
  formatearFechaHora,
  formatearFechaString,
  formatearHoraString,
  formatearMoneda,
} from "@olula/lib/dominio.ts";
import { ReactNode, isValidElement, useMemo, useState } from "react";
import { QBoton } from "./qboton.tsx";
import { MetaTabla } from "./qtabla.tsx";
import "./qtarjeta_generica.css";

type Prioridad = "alta" | "media" | "baja";

type QTarjetaGenericaProps<T extends Entidad> = {
  entidad: T;
  metaTabla: MetaTabla<T>;
  campoTituloId?: string;
  maxCamposPrioritarios?: number;
  mostrarTodosInicialmente?: boolean;
  mostrarExpansion?: boolean;
  placeholderVacio?: string;
};

const pesoPrioridad = (prioridad?: Prioridad) => {
  if (prioridad === "alta") {
    return 0;
  }
  if (prioridad === "baja") {
    return 2;
  }
  return 1;
};

const formatearValor = (
  valor: unknown,
  tipo?:
    | "texto"
    | "numero"
    | "moneda"
    | "fecha"
    | "hora"
    | "fechahora"
    | "booleano",
  divisa?: string
) => {
  if (tipo === "moneda" && typeof valor === "number") {
    return formatearMoneda(valor, divisa ?? "EUR");
  }

  if (tipo === "fecha" && typeof valor === "string") {
    return formatearFechaString(valor);
  }

  if (tipo === "fecha" && valor instanceof Date) {
    return formatearFechaDate(valor);
  }

  if (tipo === "hora" && typeof valor === "string") {
    return formatearHoraString(valor);
  }

  if (tipo === "fechahora" && valor instanceof Date) {
    return formatearFechaHora(valor);
  }

  if (tipo === "numero" && typeof valor === "number") {
    return valor.toLocaleString();
  }

  if (tipo === "booleano" && typeof valor === "boolean") {
    return valor ? "Sí" : "No";
  }

  if (typeof valor === "boolean") {
    return valor ? "Sí" : "No";
  }

  if (typeof valor === "number") {
    return valor.toString();
  }

  if (typeof valor === "string") {
    return valor;
  }

  return valor;
};

const esValorVacio = (valor: unknown) =>
  valor === undefined || valor === null || valor === "";

const valorColumna = <T extends Entidad>(
  entidad: T,
  columna: MetaTabla<T>[number],
  placeholderVacio: string
) => {
  const valorRender = columna.render?.(entidad);

  if (valorRender !== undefined && valorRender !== null) {
    if (typeof valorRender === "string" && esValorVacio(valorRender.trim())) {
      return (
        <span className="tarjeta-generica-valor-vacio">{placeholderVacio}</span>
      );
    }

    return valorRender;
  }

  const valorBruto = entidad[columna.id] as unknown;

  if (esValorVacio(valorBruto)) {
    return (
      <span className="tarjeta-generica-valor-vacio">{placeholderVacio}</span>
    );
  }

  const valorFormateado = formatearValor(
    valorBruto,
    columna.tipo,
    columna.divisa
  );

  if (isValidElement(valorFormateado)) {
    return valorFormateado;
  }

  if (
    typeof valorFormateado === "string" ||
    typeof valorFormateado === "number" ||
    typeof valorFormateado === "boolean"
  ) {
    return String(valorFormateado);
  }

  return valorFormateado as ReactNode;
};

const esCampoCorto = <T extends Entidad>(columna: MetaTabla<T>[number]) => {
  if (
    ["booleano", "numero", "moneda", "hora", "fecha"].includes(
      columna.tipo ?? ""
    )
  ) {
    return true;
  }

  return /(iva|dto|descuento|%|impuesto)/i.test(columna.id);
};

export const QTarjetaGenerica = <T extends Entidad>({
  entidad,
  metaTabla,
  campoTituloId,
  maxCamposPrioritarios = 4,
  mostrarTodosInicialmente = false,
  mostrarExpansion = true,
  placeholderVacio = "—",
}: QTarjetaGenericaProps<T>) => {
  const [expandida, setExpandida] = useState(mostrarTodosInicialmente);

  const columnaTitulo = useMemo(
    () =>
      metaTabla.find((columna) => columna.id === campoTituloId) ??
      metaTabla.find((columna) => columna.esTitulo),
    [metaTabla, campoTituloId]
  );

  const columnasDetalle = useMemo(
    () =>
      metaTabla
        .filter((columna) => columna.id !== columnaTitulo?.id)
        .sort(
          (columnaA, columnaB) =>
            pesoPrioridad(columnaA.prioridad) -
            pesoPrioridad(columnaB.prioridad)
        ),
    [metaTabla, columnaTitulo]
  );

  const columnasPrioritarias = columnasDetalle.slice(0, maxCamposPrioritarios);
  const columnasResto = columnasDetalle.slice(maxCamposPrioritarios);
  const puedeExpandir = mostrarExpansion && columnasResto.length > 0;

  const claseCampo = <U extends Entidad>(columna: MetaTabla<U>[number]) => {
    const clases = ["qtarjeta-generica-campo"];

    if (esCampoCorto(columna)) {
      clases.push("campo--corto");
    }

    if (columna.prioridad === "alta") {
      clases.push("campo--importante");
    }

    return clases.join(" ");
  };

  return (
    <article className="qtarjeta-generica" data-expandida={expandida}>
      {columnaTitulo && (
        <header className="qtarjeta-generica-cabecera">
          <span className="qtarjeta-generica-titulo-label">
            {columnaTitulo.cabecera}
          </span>
          <strong className="qtarjeta-generica-titulo-valor">
            {valorColumna(entidad, columnaTitulo, placeholderVacio)}
          </strong>
        </header>
      )}

      <section
        className="qtarjeta-generica-grid"
        aria-label="Campos prioritarios"
      >
        {columnasPrioritarias.map((columna) => (
          <div key={columna.id} className={claseCampo(columna)}>
            <span className="qtarjeta-generica-etiqueta">
              {columna.cabecera}
            </span>
            <div className="qtarjeta-generica-valor">
              {valorColumna(entidad, columna, placeholderVacio)}
            </div>
          </div>
        ))}
      </section>

      {expandida && columnasResto.length > 0 && (
        <section
          className="qtarjeta-generica-detalle"
          aria-label="Campos adicionales"
        >
          {columnasResto.map((columna) => (
            <div key={columna.id} className="qtarjeta-generica-campo-detalle">
              <span className="qtarjeta-generica-etiqueta">
                {columna.cabecera}
              </span>
              <div className="qtarjeta-generica-valor">
                {valorColumna(entidad, columna, placeholderVacio)}
              </div>
            </div>
          ))}
        </section>
      )}

      {puedeExpandir && (
        <footer className="qtarjeta-generica-footer">
          <QBoton
            tamaño="pequeño"
            variante="texto"
            onClick={(evento) => {
              evento.stopPropagation();
              setExpandida((estado) => !estado);
            }}
          >
            {expandida ? "Ver menos" : "Ver más"}
          </QBoton>
        </footer>
      )}
    </article>
  );
};
