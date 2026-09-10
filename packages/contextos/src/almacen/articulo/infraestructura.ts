import { tipoCodBarrasDesdeApi } from "#/valores/codbarras.ts";
import { RestAPI } from "@olula/lib/api/rest_api.ts";
import { Filtro, Orden } from "@olula/lib/diseño.ts";
import { criteriaQuery } from "@olula/lib/infraestructura.ts";
import {
    Articulo, ArticuloAlmacen, ArticuloAPI,
    CambiosArticulo,
    DeleteArticulo,
    GetArticulo,
    GetArticulos,
    LeerCodBarras,
    PatchArticulo,
    PostArticulo,
    SkuLote
} from "./diseño.ts";

const baseUrlArticulo = "/almacen/articulo";

type ArticuloAlmacenApi = ArticuloAlmacen;

const articuloAlmacenDesdeApi = (t: ArticuloAlmacenApi): ArticuloAlmacen => t;

export const obtenerArticulosAlmacen = async (filtro: Filtro, orden: Orden): Promise<ArticuloAlmacen[]> => {
    const q = criteriaQuery(filtro, orden);

    return RestAPI.get<{ datos: ArticuloAlmacenApi[] }>(baseUrlArticulo + q).then((respuesta) => respuesta.datos.map(articuloAlmacenDesdeApi));
}

export const ArticuloFromApi = (ArticuloApi: ArticuloAPI): Articulo => ({
    id: ArticuloApi.id,
    descripcion: ArticuloApi.descripcion,
    observaciones: ArticuloApi.observaciones ?? "",
    codbarras: ArticuloApi.codbarras ?? "",
    tipoCodBarras: tipoCodBarrasDesdeApi(ArticuloApi.tipo_codbarras),
    noStock: ArticuloApi.no_stock,
    seCompra: ArticuloApi.se_compra,
    seVende: ArticuloApi.se_vende,
});

const oNulo = (valor: string): string | null => (valor === "" ? null : valor);

const cambiosArticuloAApi = (cambios: CambiosArticulo): Record<string, unknown> => {
    const api: Record<string, unknown> = {};

    if (cambios.descripcion !== undefined) api.descripcion = cambios.descripcion;
    if (cambios.observaciones !== undefined) api.observaciones = oNulo(cambios.observaciones);
    if (cambios.codbarras !== undefined) api.codbarras = oNulo(cambios.codbarras);
    if (cambios.tipoCodBarras !== undefined) api.tipo_codbarras = oNulo(cambios.tipoCodBarras);
    if (cambios.noStock !== undefined) api.no_stock = cambios.noStock;
    if (cambios.seCompra !== undefined) api.se_compra = cambios.seCompra;
    if (cambios.seVende !== undefined) api.se_vende = cambios.seVende;

    return api;
};

export const getArticulo: GetArticulo = async (id) =>
    await RestAPI.get<{ datos: ArticuloAPI }>(`${baseUrlArticulo}/${id}`).then((respuesta) =>
        ArticuloFromApi(respuesta.datos)
    );

export const getArticulos: GetArticulos = async (
    filtro,
    orden,
    paginacion?
) => {
    const q = criteriaQuery(filtro, orden, paginacion);
    const respuesta = await RestAPI.get<{ datos: ArticuloAPI[]; total: number }>(baseUrlArticulo + q);
    return { datos: respuesta.datos.map(ArticuloFromApi), total: respuesta.total };
};

export const postArticulo: PostArticulo = async (Articulo) => {
    return await RestAPI.post(
        baseUrlArticulo,
        { descripcion: Articulo.descripcion ?? "" },
        "Error al guardar Articulo"
    ).then((respuesta) => respuesta.id);
};

export const patchArticulo: PatchArticulo = async (id, cambios) => {
    await RestAPI.patch(
        `${baseUrlArticulo}/${id}`,
        cambiosArticuloAApi(cambios),
        "Error al guardar el artículo"
    );
};

export const deleteArticulo: DeleteArticulo = async (id) => {
    await RestAPI.delete(`${baseUrlArticulo}/${id}`, "Error al borrar Articulo");
};

interface SkuLoteApi {
    id: string;
    descripcion: string;
    lote_id: string | null;
}

export const leerCodBarras: LeerCodBarras = async (codigo) =>
    await RestAPI.get<{ datos: SkuLoteApi }>(`${baseUrlArticulo}/sku_lote/${codigo}`).then(
        (respuesta): SkuLote => ({
            id: respuesta.datos.id,
            descripcion: respuesta.datos.descripcion,
            loteId: respuesta.datos.lote_id,
        })
    );
