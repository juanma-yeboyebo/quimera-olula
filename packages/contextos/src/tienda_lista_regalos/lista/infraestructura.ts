import { RestAPI } from "@olula/lib/api/rest_api.ts";
import {
    CambiosLineaListaRegalos,
    CambiosListaRegalos,
    DeleteLineaListaRegalos,
    DeleteListaRegalos,
    GetListaRegalos,
    GetListasRegalos,
    ItemListaRegalos,
    LineaListaRegalos,
    ListaRegalos,
    NuevaLineaListaRegalos,
    NuevaListaRegalos,
    PatchLineaListaRegalos,
    PatchListaRegalos,
    PostLineaListaRegalos,
    PostListaRegalos,
} from "./diseño.ts";
import { criteriaListas } from "./dominio.ts";

const baseUrl = "/tienda_lista_regalos/lista";

export interface ClienteListaApi {
    codigo: string;
    nombre: string | null;
}

export interface ItemListaApi {
    id: number;
    website_id: number;
    cliente: ClienteListaApi;
    nombre: string;
    publicada: boolean;
    creada: string;
    lineas: number;
    unidades: number;
    vendidas: number;
}

export interface LineaListaApi {
    id: number;
    referencia: string;
    descripcion: string | null;
    precio: number;
    cantidad: number;
    cantidad_vendida: number;
    pendiente: number;
    orden?: number;
}

export interface ListaApi {
    id: number;
    website_id: number;
    cliente: ClienteListaApi;
    nombre: string;
    descripcion: string | null;
    token: string;
    url: string | null;
    publicada: boolean;
    creada: string;
    lineas: LineaListaApi[];
}

const clienteDesdeApi = (c: ClienteListaApi) => ({
    codigo: c.codigo,
    nombre: c.nombre ?? "",
});

export const itemListaDesdeApi = (i: ItemListaApi): ItemListaRegalos => ({
    id: String(i.id),
    websiteId: i.website_id,
    cliente: clienteDesdeApi(i.cliente),
    nombre: i.nombre,
    publicada: i.publicada,
    creada: i.creada,
    lineas: i.lineas,
    unidades: i.unidades,
    vendidas: i.vendidas,
});

export const lineaListaDesdeApi = (l: LineaListaApi, indice: number): LineaListaRegalos => ({
    id: String(l.id),
    referencia: l.referencia,
    descripcion: l.descripcion ?? "",
    precio: l.precio,
    cantidad: l.cantidad,
    cantidadVendida: l.cantidad_vendida,
    pendiente: l.pendiente,
    orden: l.orden ?? indice + 1,
});

export const listaDesdeApi = (l: ListaApi): ListaRegalos => ({
    id: String(l.id),
    websiteId: l.website_id,
    cliente: clienteDesdeApi(l.cliente),
    nombre: l.nombre,
    descripcion: l.descripcion ?? "",
    token: l.token,
    url: l.url ?? null,
    publicada: l.publicada,
    creada: l.creada,
    lineas: l.lineas.map(lineaListaDesdeApi),
});

export const nuevaListaAApi = (websiteId: number, n: NuevaListaRegalos) => ({
    id_website: websiteId,
    cliente_id: n.clienteId,
    nombre: n.nombre.trim(),
    descripcion: n.descripcion ? n.descripcion : null,
});

export const cambiosListaAApi = (c: CambiosListaRegalos) => {
    const cambios: { nombre?: string; descripcion?: string; cliente_id?: string; publicada?: boolean } = {};
    if (c.nombre !== undefined) cambios.nombre = c.nombre;
    if (c.descripcion !== undefined) cambios.descripcion = c.descripcion;
    if (c.clienteId !== undefined) cambios.cliente_id = c.clienteId;
    if (c.publicada !== undefined) cambios.publicada = c.publicada;
    return cambios;
};

export const nuevaLineaAApi = (n: NuevaLineaListaRegalos) => ({
    referencia: n.referencia,
    cantidad: n.cantidad,
    ...(n.precio === null || n.precio === undefined ? {} : { precio: n.precio }),
});

export const cambiosLineaAApi = (c: CambiosLineaListaRegalos) => {
    const cambios: { precio?: number; cantidad?: number; cantidad_vendida?: number; orden?: number } = {};
    if (c.precio !== undefined) cambios.precio = c.precio;
    if (c.cantidad !== undefined) cambios.cantidad = c.cantidad;
    if (c.cantidadVendida !== undefined) cambios.cantidad_vendida = c.cantidadVendida;
    if (c.orden !== undefined) cambios.orden = c.orden;
    return cambios;
};

export const getListaRegalos: GetListaRegalos = async (id) =>
    RestAPI.getItem<ListaRegalos, ListaApi>(
        `${baseUrl}/${id}`,
        listaDesdeApi,
        "Error al cargar la lista de regalos",
    );

export const getListasRegalos: GetListasRegalos = async (filtros, criteria) =>
    RestAPI.getQuery<ItemListaRegalos, ItemListaApi>(
        baseUrl,
        criteriaListas(filtros, criteria),
        itemListaDesdeApi,
        "Error al cargar las listas de regalo",
    );

export const postListaRegalos: PostListaRegalos = async (websiteId, nueva) => {
    const respuesta = await RestAPI.post(
        baseUrl,
        nuevaListaAApi(websiteId, nueva),
        "Error al crear la lista de regalos",
    );
    return String(respuesta.id);
};

export const patchListaRegalos: PatchListaRegalos = async (id, cambios) => {
    await RestAPI.patch(
        `${baseUrl}/${id}`,
        cambiosListaAApi(cambios),
        "Error al guardar la lista de regalos",
    );
};

export const deleteListaRegalos: DeleteListaRegalos = async (id) => {
    await RestAPI.delete(`${baseUrl}/${id}`, "Error al borrar la lista de regalos");
};

export const postLineaListaRegalos: PostLineaListaRegalos = async (id, nueva) => {
    const respuesta = await RestAPI.post(
        `${baseUrl}/${id}/linea`,
        nuevaLineaAApi(nueva),
        "Error al añadir el producto",
    );
    return String(respuesta.id);
};

export const patchLineaListaRegalos: PatchLineaListaRegalos = async (id, lineaId, cambios) => {
    await RestAPI.patch(
        `${baseUrl}/${id}/linea/${lineaId}`,
        cambiosLineaAApi(cambios),
        "Error al cambiar el producto",
    );
};

export const deleteLineaListaRegalos: DeleteLineaListaRegalos = async (id, lineaId) => {
    await RestAPI.delete(`${baseUrl}/${id}/linea/${lineaId}`, "Error al borrar el producto");
};
