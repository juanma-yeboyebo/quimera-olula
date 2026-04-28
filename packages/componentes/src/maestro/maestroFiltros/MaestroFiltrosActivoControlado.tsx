import {
  ClausulaFiltro,
  Entidad,
  Filtro,
  TipoInput,
} from "@olula/lib/diseño.ts";
import { useModelo } from "@olula/lib/useModelo.js";
import { ReactNode, useMemo, useState } from "react";
import { QBoton } from "../../atomos/qboton.tsx";
import { QCheckbox } from "../../atomos/qcheckbox.tsx";
import { QDateInterval } from "../../atomos/qdateinterval.tsx";
import { QIcono } from "../../atomos/qicono.tsx";
import { QInput } from "../../atomos/qinput.tsx";
import { Opcion, QMultiCheckbox } from "../../atomos/qmulticheckbox.tsx";
import { QNumberInterval } from "../../atomos/qnumberinterval.tsx";
import { MetaTabla } from "../../atomos/qtabla.tsx";
import "./MaestroFiltrosActivoControlado.css";

export const filtroTextos = (id: string, valor: unknown) => {
  return [id, "~", valor as string] as ClausulaFiltro;
};

export const filtroBooleanos = (id: string, valor: unknown) => {
  return [id, "=", valor as string] as ClausulaFiltro;
};

export const filtroFechas = (id: string, valor: unknown) => {
  const [desde, hasta] = valor as [Date, Date];

  const operador =
    !!desde && !hasta
      ? ">="
      : !!hasta && !desde
        ? "<="
        : !!desde && !!hasta
          ? "<>"
          : "";

  return [
    id,
    operador,
    [
      desde ? desde.toISOString().slice(0, 10) : undefined,
      hasta ? hasta.toISOString().slice(0, 10) : undefined,
    ].join("_"),
  ] as ClausulaFiltro;
};

export const filtroNumeros = (id: string, valor: unknown) => {
  const [desde, hasta] = valor as [number, number];

  const operador =
    !!desde && !hasta
      ? ">="
      : !!hasta && !desde
        ? "<="
        : !!desde && !!hasta
          ? "<>"
          : "";

  return [
    id,
    operador,
    [isNaN(desde) ? undefined : desde, isNaN(hasta) ? undefined : hasta].join(
      "_"
    ),
  ] as ClausulaFiltro;
};

type MetaCampoFiltro = {
  id: string;
  label: string;
  tipo?: TipoInput;
  opciones?: Opcion[];
  valorDefecto?: unknown;
  filtro: (v: unknown) => ClausulaFiltro | null;
  fromFiltro?: (filtro: Filtro) => unknown;
  render?: (valor: unknown, onChange: (v: unknown) => void) => ReactNode;
};

export type MetaFiltro = Record<string, MetaCampoFiltro>;

export const getMetaFiltroDefecto = <T extends Entidad>(
  metaTabla: MetaTabla<T>
): MetaFiltro => {
  const campos: Record<string, MetaCampoFiltro> = {};

  for (const columna of metaTabla) {
    if (columna.id === "id") continue;

    switch (columna.tipo) {
      case "booleano":
        campos[columna.id] = {
          id: columna.id,
          label: columna.cabecera,
          tipo: "checkbox",
          filtro: (valor) => filtroBooleanos(columna.id, valor),
        };
        break;
      case "fecha":
      case "fechahora":
      case "hora":
        campos[columna.id] = {
          id: columna.id,
          label: columna.cabecera,
          tipo: "intervalo_fechas",
          filtro: (valor) => filtroFechas(columna.id, valor),
        };
        break;
      case "numero":
      case "moneda":
        campos[columna.id] = {
          id: columna.id,
          label: columna.cabecera,
          tipo: "intervalo_numeros",
          filtro: (valor) => filtroNumeros(columna.id, valor),
        };
        break;
      default:
        campos[columna.id] = {
          id: columna.id,
          label: columna.cabecera,
          tipo: "texto",
          filtro: (valor) => filtroTextos(columna.id, valor),
        };
        break;
    }
  }

  return campos;
};

export const filtroToValores = (filtro: Filtro, meta: MetaFiltro) => {
  const valores: Record<string, unknown> = {};

  for (const [id, campo] of Object.entries(meta)) {
    if (campo.valorDefecto !== undefined) valores[id] = campo.valorDefecto;
  }

  for (const clausula of filtro) {
    const [campo, _, valor] = clausula;

    if (valor?.includes("_")) valores[campo] = valor.split("_").filter(Boolean);
    else valores[campo] = valor;

    const valor_final = valores[campo];

    if (!meta[campo]) continue;

    switch (meta[campo].tipo) {
      case "intervalo_fechas": {
        valores[campo] = (valor_final as [string, string])?.map((f: string) =>
          f ? new Date(Date.parse(f)) : undefined
        );
        break;
      }
      case "intervalo_numeros":
        valores[campo] = (valor_final as [string, string])?.map((f: string) =>
          f ? parseFloat(f) : undefined
        );
        break;
      case "multiseleccion":
        valores[campo] = Array.isArray(valores[campo])
          ? valores[campo]
          : [valores[campo]];
        break;
      case "fecha":
        valores[campo] = new Date(Date.parse(valor_final as string));
        break;
    }
  }

  for (const [id, campo] of Object.entries(meta)) {
    if (campo.fromFiltro) valores[id] = campo.fromFiltro(filtro);
  }

  return valores;
};

type MaestroFiltrosActivoControladoProps = {
  metaFiltro: MetaFiltro;
  filtroInicial: Filtro;
  filtro: Filtro;
  onFiltroChanged: (filtro: Filtro) => void;
};

export const MaestroFiltrosActivoControlado = ({
  metaFiltro,
  filtroInicial,
  filtro,
  onFiltroChanged,
}: MaestroFiltrosActivoControladoProps) => {
  const valoresIniciales = useMemo(
    () => filtroToValores(filtro, metaFiltro),
    [filtro, metaFiltro]
  );

  const valores = useModelo({ campos: metaFiltro }, valoresIniciales);
  const { modelo, modeloInicial, uiProps, init } = valores;

  const [mostrar, setMostar] = useState(false);

  const renderFiltros = () => {
    return Object.entries(metaFiltro).map(([_, campo]) => {
      const renderInput = () => {
        if (campo.render) {
          const { valor, onChange: onChangeProp } = uiProps(campo.id);
          const onChange = onChangeProp as (v: unknown) => void;
          return campo.render(valor, onChange);
        }
        switch (campo.tipo) {
          case "intervalo_fechas":
            return (
              <QDateInterval
                {...uiProps(campo.id)}
                tipo={"fecha"}
                label={campo.label}
              />
            );
          case "intervalo_numeros":
            return (
              <QNumberInterval
                {...uiProps(campo.id)}
                tipo={"numero"}
                label={campo.label}
              />
            );
          case "multiseleccion":
            return (
              <QMultiCheckbox
                {...uiProps(campo.id)}
                opciones={campo.opciones as Opcion[]}
                label={campo.label}
              />
            );
          case "checkbox":
            return <QCheckbox {...uiProps(campo.id)} label={campo.label} />;
          default:
            return <QInput {...uiProps(campo.id)} label={campo.label} />;
        }
      };

      return (
        <div key={campo.id} className="campo-filtro">
          {renderInput()}
          <QBoton tamaño="pequeño" onClick={() => limpiarUno(campo.id)}>
            <QIcono nombre="cerrar" tamaño="xs" color="currentColor" />
          </QBoton>
        </div>
      );
    });
  };

  const buildFiltros = (modeloOverride: Record<string, unknown>) => {
    return Object.entries(modeloOverride).flatMap(([id, valor]) => {
      if (!metaFiltro[id]) return [];
      if (valor === undefined || valor === null) return [];
      const clausula = metaFiltro[id].filtro(valor);
      return clausula ? [clausula] : [];
    });
  };

  const onBuscar = (): void => {
    onFiltroChanged(buildFiltros(modelo));
  };

  const onLimpiar = () => {
    init(modeloInicial);
    onFiltroChanged(filtroInicial);
  };

  const limpiarUno = (id: string) => {
    const valorDefecto = metaFiltro[id]?.valorDefecto ?? undefined;

    if (valorDefecto) {
      const filtros = filtro.filter(([campo]) => campo !== id);
      const [_, operador] = filtro.filter(([campo]) => campo === id)[0];

      init({ ...modelo, [id]: valorDefecto });
      onFiltroChanged([...filtros, [id, operador, valorDefecto as string]]);
    } else {
      const filtros = filtro.filter(([campo]) => campo !== id);
      onFiltroChanged(filtros);
    }
  };

  if (!Object.keys(metaFiltro).length) return;

  if (!mostrar)
    return (
      <div className="MaestroFiltrosControlado">
        <QBoton tamaño="pequeño" onClick={() => setMostar(true)}>
          Filtros ({filtro.length - filtroInicial.length})
        </QBoton>
      </div>
    );

  return (
    <div className="MaestroFiltrosControlado">
      <QBoton tamaño="pequeño" onClick={() => setMostar(false)}>
        Cerrar filtros
      </QBoton>
      <quimera-formulario>{renderFiltros()}</quimera-formulario>
      <footer>
        <QBoton tamaño="pequeño" onClick={onBuscar}>
          Buscar
        </QBoton>
        <QBoton variante="texto" tamaño="pequeño" onClick={onLimpiar}>
          Limpiar
        </QBoton>
      </footer>
    </div>
  );
};
