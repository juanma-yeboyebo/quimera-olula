import { useMaquina } from "@olula/componentes/hook/useMaquina.ts";
import { MetaTabla } from "@olula/componentes/index.js";
import { Listado } from "@olula/componentes/maestro/Listado.js";
import { MetaFiltro } from "@olula/componentes/maestro/maestroFiltros/MaestroFiltrosActivoControlado.js";
import { MaestroDetalle } from "@olula/componentes/maestro/MaestroDetalle.tsx";
import { ClausulaFiltro } from "@olula/lib/diseño.ts";
import { criteriaDefecto } from "@olula/lib/dominio.ts";
import { listaActivaEntidadesInicial } from "@olula/lib/ListaActivaEntidades.ts";
import { getUrlParams, useUrlParams } from "@olula/lib/url-params.ts";
import { useEffect, useMemo } from "react";
import { DetalleArticulo } from "../detalle/DetalleArticulo.tsx";
import { Articulo } from "../diseño.ts";
import { CAMPO_INCLUIR_NO_COMPRABLES } from "../dominio.ts";
import { getMaquina } from "./maquina.ts";
import { TarjetaArticulo } from "./TarjetaArticulo.tsx";

const metaTablaArticulo: MetaTabla<Articulo> = [
  { id: "id", cabecera: "Referencia" },
  { id: "descripcion", cabecera: "Descripción" },
  { id: "cod_impuesto", cabecera: "Impuesto", render: (a) => a.codImpuesto },
];

const filtroBooleano =
  (campo: string) =>
  (valor: unknown): ClausulaFiltro | null =>
    valor === undefined || valor === null || valor === ""
      ? null
      : [campo, "=", String(valor)];

const metaFiltroArticulo: MetaFiltro = {
  id: {
    id: "id",
    label: "Referencia",
    filtro: (v) => (v ? ["id", "~", v as string] : null),
  },
  descripcion: {
    id: "descripcion",
    label: "Descripción",
    filtro: (v) => (v ? ["descripcion", "~", v as string] : null),
  },
  cod_impuesto: {
    id: "cod_impuesto",
    label: "Impuesto",
    filtro: (v) => (v ? ["cod_impuesto", "=", v as string] : null),
  },
  no_stock: {
    id: "no_stock",
    label: "No controla stock",
    tipo: "checkbox",
    filtro: filtroBooleano("no_stock"),
  },
  incluir_no_comprables: {
    id: CAMPO_INCLUIR_NO_COMPRABLES,
    label: "Incluir artículos no comprables",
    tipo: "checkbox",
    filtro: (v) =>
      v === "true" ? [CAMPO_INCLUIR_NO_COMPRABLES, "=", "true"] : null,
  },
};

export const MaestroConDetalleArticulo = () => {
  const criteriaBase = useMemo(() => criteriaDefecto, []);

  const { id, criteria } = getUrlParams();
  const criteriaInicial = criteria.filtro.length > 0 ? criteria : criteriaBase;

  const { ctx, emitir } = useMaquina(getMaquina, {
    estado: "INICIAL",
    articulos: listaActivaEntidadesInicial<Articulo>(id, criteriaInicial),
  });

  const { articulos } = ctx;

  useUrlParams(articulos.activo, articulos.criteria);

  useEffect(() => {
    emitir("recarga_de_articulos_solicitada", articulos.criteria);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="Articulo">
      <MaestroDetalle<Articulo>
        Maestro={
          <>
            <h2>Artículos</h2>
            <Listado<Articulo>
              metaTabla={metaTablaArticulo}
              metaFiltro={metaFiltroArticulo}
              tarjeta={TarjetaArticulo}
              criteria={articulos.criteria}
              modoInicial="tabla"
              entidades={articulos.lista}
              totalEntidades={articulos.total}
              seleccionada={articulos.activo}
              onSeleccion={(payload) => emitir("articulo_seleccionado", payload)}
              onCriteriaChanged={(payload) => emitir("criteria_cambiado", payload)}
              onSiguientePagina={(payload) => emitir("siguiente_pagina", payload)}
            />
          </>
        }
        Detalle={<DetalleArticulo id={articulos.activo} publicar={emitir} />}
        seleccionada={articulos.activo}
        modoDisposicion="maestro-50"
      />
    </div>
  );
};
