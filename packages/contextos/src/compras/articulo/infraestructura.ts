import { RestAPI } from "@olula/lib/api/rest_api.ts";
import ApiUrls from "../comun/urls.ts";
import {
    Articulo,
    CambiosArticulo,
    GetArticulo,
    GetArticulos,
    PatchArticulo,
} from "./diseño.ts";
import { filtroArticulosCompra } from "./dominio.ts";

interface ArticuloApi {
    id: string;
    descripcion: string;
    observaciones: string | null;
    cod_impuesto: string | null;
    no_stock: boolean;
    se_compra: boolean;
}

const baseUrl = new ApiUrls().ARTICULO;

export const articuloDesdeApi = (api: ArticuloApi): Articulo => ({
    id: api.id,
    descripcion: api.descripcion,
    observaciones: api.observaciones ?? "",
    codImpuesto: api.cod_impuesto ?? "",
    noStock: api.no_stock,
    seCompra: api.se_compra,
});

const oNulo = (valor: string): string | null => valor === "" ? null : valor;

const cambiosArticuloAApi = (cambios: CambiosArticulo): Record<string, unknown> => {
    const api: Record<string, unknown> = {};

    if (cambios.descripcion !== undefined) api.descripcion = cambios.descripcion;
    if (cambios.observaciones !== undefined) api.observaciones = oNulo(cambios.observaciones);
    if (cambios.codImpuesto !== undefined) api.cod_impuesto = oNulo(cambios.codImpuesto);

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

export const patchArticulo: PatchArticulo = async (id, cambios) => {
    await RestAPI.patch(
        `${baseUrl}/${id}`,
        cambiosArticuloAApi(cambios),
        "Error al guardar el artículo"
    );
};
