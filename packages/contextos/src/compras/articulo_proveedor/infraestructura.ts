import { RestAPI } from "@olula/lib/api/rest_api.ts";
import ApiUrls from "../comun/urls.ts";
import {
    ArticuloProveedor,
    CambiosArticuloProveedor,
    DeleteArticuloProveedor,
    GetArticuloProveedor,
    GetArticulosDeProveedor,
    GetProveedoresDeArticulo,
    MarcarPorDefectoArticuloProveedor,
    NuevoArticuloProveedor,
    PatchArticuloProveedor,
    PostArticuloProveedor,
} from "./diseño.ts";

interface ArticuloProveedorApi {
    id: string;
    articulo_id: string;
    articulo: string;
    proveedor_id: string;
    proveedor: string;
    nombre: string;
    coste: number;
    divisa_id: string;
    dto: number;
    ref_proveedor: string | null;
    plazo: number | null;
    uni_embalaje: number | null;
    requiere_embalajes: boolean;
    por_defecto: boolean;
}

const urls = new ApiUrls();
const baseUrl = urls.ARTICULO_PROVEEDOR;

export const articuloProveedorDesdeApi = (
    api: ArticuloProveedorApi
): ArticuloProveedor => ({
    id: String(api.id),
    articuloId: api.articulo_id,
    articulo: api.articulo,
    proveedorId: api.proveedor_id,
    proveedor: api.proveedor,
    nombre: api.nombre,
    coste: api.coste,
    divisaId: api.divisa_id,
    dto: api.dto,
    refProveedor: api.ref_proveedor ?? "",
    plazo: api.plazo,
    uniEmbalaje: api.uni_embalaje,
    requiereEmbalajes: api.requiere_embalajes,
    porDefecto: api.por_defecto,
});

const oNulo = (valor: string): string | null => (valor === "" ? null : valor);

const nuevoAApi = (nuevo: NuevoArticuloProveedor): Record<string, unknown> => ({
    articulo_id: nuevo.articuloId,
    proveedor_id: nuevo.proveedorId,
    coste: nuevo.coste,
    ...(nuevo.proveedor ? { nombre: nuevo.proveedor } : {}),
    ...(nuevo.divisaId ? { divisa_id: nuevo.divisaId } : {}),
    dto: nuevo.dto,
    ref_proveedor: oNulo(nuevo.refProveedor),
    plazo: nuevo.plazo,
    uni_embalaje: nuevo.uniEmbalaje,
    requiere_embalajes: nuevo.requiereEmbalajes,
});

const cambiosAApi = (
    cambios: CambiosArticuloProveedor
): Record<string, unknown> => {
    const api: Record<string, unknown> = {};

    if (cambios.nombre !== undefined) api.nombre = cambios.nombre;
    if (cambios.coste !== undefined) api.coste = cambios.coste;
    if (cambios.divisaId !== undefined) api.divisa_id = cambios.divisaId;
    if (cambios.dto !== undefined) api.dto = cambios.dto;
    if (cambios.refProveedor !== undefined) api.ref_proveedor = oNulo(cambios.refProveedor);
    if (cambios.plazo !== undefined) api.plazo = cambios.plazo;
    if (cambios.uniEmbalaje !== undefined) api.uni_embalaje = cambios.uniEmbalaje;
    if (cambios.requiereEmbalajes !== undefined) api.requiere_embalajes = cambios.requiereEmbalajes;

    return api;
};

export const getProveedoresDeArticulo: GetProveedoresDeArticulo = async (articuloId) => {
    const respuesta = await RestAPI.get<{ datos: ArticuloProveedorApi[]; total: number }>(
        `${urls.ARTICULO}/${articuloId}/proveedor`,
        "Error al obtener los proveedores del artículo"
    );

    return {
        datos: respuesta.datos.map(articuloProveedorDesdeApi),
        total: respuesta.total,
    };
};

export const getArticulosDeProveedor: GetArticulosDeProveedor = async (
    proveedorId,
    criteria
) =>
    await RestAPI.getQuery<ArticuloProveedor, ArticuloProveedorApi>(
        `${urls.PROVEEDOR}/${proveedorId}/articulo`,
        criteria,
        articuloProveedorDesdeApi,
        "Error al obtener los artículos del proveedor"
    );

export const getArticuloProveedor: GetArticuloProveedor = async (id) =>
    await RestAPI.getItem<ArticuloProveedor, ArticuloProveedorApi>(
        `${baseUrl}/${id}`,
        articuloProveedorDesdeApi,
        "Error al obtener el precio de proveedor"
    );

export const postArticuloProveedor: PostArticuloProveedor = async (nuevo) => {
    const respuesta = await RestAPI.post(
        baseUrl,
        nuevoAApi(nuevo),
        "Error al crear el precio de proveedor"
    );

    return String(respuesta.id);
};

export const patchArticuloProveedor: PatchArticuloProveedor = async (id, cambios) => {
    await RestAPI.patch(
        `${baseUrl}/${id}`,
        cambiosAApi(cambios),
        "Error al guardar el precio de proveedor"
    );
};

export const deleteArticuloProveedor: DeleteArticuloProveedor = async (id) => {
    await RestAPI.delete(`${baseUrl}/${id}`, "Error al borrar el precio de proveedor");
};

export const marcarPorDefecto: MarcarPorDefectoArticuloProveedor = async (id) => {
    await RestAPI.patch(
        `${baseUrl}/${id}/por-defecto`,
        {},
        "Error al marcar el proveedor por defecto"
    );
};
