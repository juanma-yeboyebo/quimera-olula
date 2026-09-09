import { Articulo as ArticuloSelect } from "#/ventas/comun/componentes/articulo.tsx";
import { GrupoIvaProducto } from "#/ventas/comun/componentes/grupo_iva_producto.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.ts";
import { MetaTabla } from "@olula/componentes/index.js";
import { Listado } from "@olula/componentes/maestro/Listado.js";
import {
  filtroNumeros,
  MetaFiltro,
} from "@olula/componentes/maestro/maestroFiltros/MaestroFiltrosActivoControlado.js";
import { MaestroDetalle } from "@olula/componentes/maestro/MaestroDetalle.tsx";
import { listaActivaEntidadesInicial } from "@olula/lib/ListaActivaEntidades.js";
import { getUrlParams, useUrlParams } from "@olula/lib/url-params.js";
import { useEffect } from "react";
import { DetalleArticulo } from "./detalle/DetalleArticulo.tsx";
import { Articulo } from "./diseño.ts";
import { CAMPO_INCLUIR_NO_VENDIBLES } from "./dominio.ts";
import { getMaquina } from "./maestro/maquina.ts";
import { TarjetaArticulo } from "./TarjetaArticulo.tsx";

const metaTablaArticulo: MetaTabla<Articulo> = [
  { id: "id", cabecera: "Referencia" },
  { id: "descripcion", cabecera: "Descripción" },
  { id: "codbarras", cabecera: "Cód. barras" },
  { id: "precio", cabecera: "Precio", tipo: "moneda" },
  {
    id: "grupo_iva_producto_id",
    cabecera: "Grupo IVA",
    render: (a) => a.grupoIvaProductoId,
  },
];

export const MaestroConDetalleArticulo = () => {
  const { id, criteria } = getUrlParams();

  const { ctx, emitir } = useMaquina(getMaquina, {
    estado: "INICIAL",
    articulos: listaActivaEntidadesInicial<Articulo>(id, criteria),
  });

  useUrlParams(ctx.articulos.activo, ctx.articulos.criteria);

  useEffect(() => {
    emitir("recarga_de_articulos_solicitada", ctx.articulos.criteria);
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
              tarjeta={TarjetaArticulo}
              metaFiltro={metaFiltro}
              criteria={ctx.articulos.criteria}
              entidades={ctx.articulos.lista}
              totalEntidades={ctx.articulos.total}
              seleccionada={ctx.articulos.activo}
              onSeleccion={(payload) => emitir("articulo_seleccionado", payload)}
              onCriteriaChanged={(payload) => emitir("criteria_cambiado", payload)}
              onSiguientePagina={(payload) => emitir("siguiente_pagina", payload)}
            />
          </>
        }
        Detalle={<DetalleArticulo id={ctx.articulos.activo} publicar={emitir} />}
        seleccionada={ctx.articulos.activo}
        modoDisposicion="maestro-50"
      />
    </div>
  );
};

const metaFiltro: MetaFiltro = {
  articulo: {
    id: "articulo",
    campo: "id",
    label: "Artículo",
    filtro: (v) => (v ? ["id", "=", v as string] : null),
    render: (valor, onChange) => (
      <ArticuloSelect
        valor={(valor as string) ?? ""}
        onChange={(opcion) => onChange(opcion?.valor ?? "")}
      />
    ),
  },
  descripcion: {
    id: "descripcion",
    campo: "nombre",
    label: "Descripción",
    filtro: (v) => (v ? ["nombre", "~", v as string] : null),
  },
  codbarras: {
    id: "codbarras",
    label: "Cód. barras",
    filtro: (v) => (v ? ["codbarras", "~", v as string] : null),
  },
  precio: {
    id: "precio",
    label: "Precio",
    tipo: "intervalo_numeros",
    filtro: (v) => filtroNumeros("precio", v),
  },
  grupo_iva_producto: {
    id: "grupo_iva_producto",
    campo: "grupo_iva_producto_id",
    label: "Grupo IVA",
    filtro: (v) => (v ? ["grupo_iva_producto_id", "=", v as string] : null),
    render: (valor, onChange) => (
      <GrupoIvaProducto
        nombre="grupo_iva_producto"
        valor={(valor as string) ?? ""}
        onChange={(opcion) => onChange(opcion?.valor ?? "")}
      />
    ),
  },
  no_stock: {
    id: "no_stock",
    label: "No controla stock",
    tipo: "checkbox",
    filtro: (v) =>
      v === undefined || v === null || v === ""
        ? null
        : ["no_stock", "=", String(v)],
  },
  incluir_no_vendibles: {
    id: CAMPO_INCLUIR_NO_VENDIBLES,
    label: "Incluir artículos no vendibles",
    tipo: "checkbox",
    filtro: (v) =>
      v === "true" ? [CAMPO_INCLUIR_NO_VENDIBLES, "=", "true"] : null,
  },
};
