import { RestAPI } from "@olula/lib/api/rest_api.ts";
import ApiUrls from "../comun/urls.ts";
import {
    Articulo,
    CambiosArticulo,
    GetArticulo,
    GetArticulos,
    PatchArticulo,
    PostArticulo,
} from "./diseño.ts";
import { filtroArticulosCompra } from "./dominio.ts";

interface ArticuloApi {
    id: string;
    descripcion: string;
    observaciones: string | null;
    grupo_iva_producto_id: string | null;
    no_stock: boolean;
    se_compra: boolean;
}

const baseUrl = new ApiUrls().ARTICULO;

export const articuloDesdeApi = (api: ArticuloApi): Articulo => ({
    id: api.id,
    descripcion: api.descripcion,
    observaciones: api.observaciones ?? "",
    grupoIvaProductoId: api.grupo_iva_producto_id ?? "",
    noStock: api.no_stock,
    seCompra: api.se_compra,
});

const oNulo = (valor: string): string | null => valor === "" ? null : valor;

const cambiosArticuloAApi = (cambios: CambiosArticulo): Record<string, unknown> => {
    const api: Record<string, unknown> = {};

    if (cambios.descripcion !== undefined) api.descripcion = cambios.descripcion;
    if (cambios.observaciones !== undefined) api.observaciones = oNulo(cambios.observaciones);
    if (cambios.grupoIvaProductoId !== undefined) api.grupo_iva_producto_id = oNulo(cambios.grupoIvaProductoId);

    return api;
};

export const getArticulo: GetArticulo = async (id) =>
    await RestAPI.getItem<Articulo, ArticuloApi>(
        `${baseUrl}/${id}`,
        articuloDesdeApi,
        "Error al obtener el artículo"
    );

export const getArticulos: GetArticulos = async (criteria) =>
    await RestAPI.getQuery<Articulo, ArticuloApi>(
        baseUrl,
        { ...criteria, filtro: filtroArticulosCompra(criteria.filtro) },
        articuloDesdeApi,
        "Error al obtener los artículos"
    );

export const postArticulo: PostArticulo = async (articulo) =>
    await RestAPI.post(
        baseUrl,
        { descripcion: articulo.descripcion ?? "" },
        "Error al crear el artículo"
    ).then((respuesta) => String(respuesta.id));

export const patchArticulo: PatchArticulo = async (id, cambios) => {
    await RestAPI.patch(
        `${baseUrl}/${id}`,
        cambiosArticuloAApi(cambios),
        "Error al guardar el artículo"
    );
};
