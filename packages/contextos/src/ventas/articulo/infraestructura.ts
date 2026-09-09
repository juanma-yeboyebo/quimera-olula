import { tipoCodBarrasDesdeApi } from "#/valores/codbarras.ts";
import { RestAPI } from "@olula/lib/api/rest_api.ts";
import { criteriaQuery } from "@olula/lib/infraestructura.ts";
import {
    Articulo,
    CambiosArticulo,
    GetArticulo,
    GetArticulos,
    GetTagsArticulo,
    PatchArticulo,
    TagArticulo,
} from "./diseño.ts";
import { filtroArticulosVenta } from "./dominio.ts";

const baseUrl = `/ventas/articulo`;

interface ArticuloApi {
    id: string;
    descripcion: string;
    codbarras: string | null;
    tipo_codbarras: string | null;
    observaciones: string | null;
    precio: number;
    grupo_iva_producto_id: string;
    pvp_variable: boolean;
    no_stock: boolean;
}

interface TagArticuloApi {
    id: string;
    descripcion: string;
    precio: number;
    grupo_iva_producto_id: string;
    codbarras: string | null;
}

const articuloDesdeApi = (a: ArticuloApi): Articulo => ({
    id: a.id,
    descripcion: a.descripcion,
    codbarras: a.codbarras ?? "",
    tipoCodBarras: tipoCodBarrasDesdeApi(a.tipo_codbarras),
    observaciones: a.observaciones ?? "",
    precio: a.precio,
    grupoIvaProductoId: a.grupo_iva_producto_id,
    pvpVariable: a.pvp_variable,
    noStock: a.no_stock,
});

const tagArticuloDesdeApi = (t: TagArticuloApi): TagArticulo => ({
    id: t.id,
    descripcion: t.descripcion,
    precio: t.precio,
    grupoIvaProductoId: t.grupo_iva_producto_id,
    codbarras: t.codbarras ?? "",
});

const oNulo = (valor: string): string | null => valor === "" ? null : valor;

const cambiosArticuloAApi = (cambios: CambiosArticulo): Record<string, unknown> => {
    const api: Record<string, unknown> = {};

    if (cambios.descripcion !== undefined) api.descripcion = cambios.descripcion;
    if (cambios.codbarras !== undefined) api.codbarras = oNulo(cambios.codbarras);
    if (cambios.tipoCodBarras !== undefined) api.tipo_codbarras = oNulo(cambios.tipoCodBarras);
    if (cambios.observaciones !== undefined) api.observaciones = oNulo(cambios.observaciones);
    if (cambios.precio !== undefined) api.precio = cambios.precio;
    if (cambios.grupoIvaProductoId !== undefined) api.grupo_iva_producto_id = oNulo(cambios.grupoIvaProductoId);

    return api;
};

export const getArticulos: GetArticulos = async (filtro, orden, paginacion) => {
    const q = criteriaQuery(filtroArticulosVenta(filtro), orden, paginacion);
    return RestAPI.get<{ datos: ArticuloApi[] }>(`${baseUrl}${q}`).then(
        (respuesta) => respuesta.datos.map(articuloDesdeApi)
    );
};

export const getArticulo: GetArticulo = async (id) =>
    RestAPI.get<{ datos: ArticuloApi }>(`${baseUrl}/${id}`).then(
        (respuesta) => articuloDesdeApi(respuesta.datos)
    );

export const getTagsArticulo: GetTagsArticulo = async (filtro, orden) => {
    const q = criteriaQuery(filtro, orden);
    return RestAPI.get<{ datos: TagArticuloApi[] }>(`${baseUrl}/tags${q}`).then(
        (respuesta) => respuesta.datos.map(tagArticuloDesdeApi)
    );
};

export const patchArticulo: PatchArticulo = async (id, cambios) => {
    await RestAPI.patch(
        `${baseUrl}/${id}`,
        cambiosArticuloAApi(cambios),
        "Error al guardar el artículo"
    );
};
