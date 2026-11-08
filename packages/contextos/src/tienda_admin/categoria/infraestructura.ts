import { RestAPI } from "@olula/lib/api/rest_api.ts";
import TiendaAdmin_Urls from "../comun/urls.ts";
import {
    CambiosCategoria,
    DeleteCategoria,
    GetArbolCategorias,
    NodoCategoria,
    NuevaCategoria,
    PatchCategoria,
    PatchMoverCategoria,
    PatchOrdenarCategorias,
    PostCategoria,
} from "./diseño.ts";

const baseUrl = new TiendaAdmin_Urls().CATEGORIA;

export interface NodoCategoriaApi {
    id: number;
    padre_id: number | null;
    codigo: string;
    nombre: string;
    slug: string;
    orden: number;
    visible: boolean;
    en_menu: boolean;
    articulos: number;
    hijas: NodoCategoriaApi[];
}

const aNumero = (id: string | null): number | null => (id === null ? null : Number(id));

export const nodoDesdeApi = (n: NodoCategoriaApi): NodoCategoria => ({
    id: String(n.id),
    padreId: n.padre_id === null || n.padre_id === undefined ? null : String(n.padre_id),
    codigo: n.codigo,
    nombre: n.nombre,
    slug: n.slug,
    orden: n.orden,
    visible: n.visible,
    enMenu: n.en_menu,
    articulos: n.articulos,
    hijas: (n.hijas ?? []).map(nodoDesdeApi),
});

export const nuevaCategoriaAApi = (
    websiteId: number,
    padreId: string | null,
    n: NuevaCategoria,
) => ({
    website_id: websiteId,
    padre_id: aNumero(padreId),
    codigo: n.codigo.trim(),
    nombre: n.nombre.trim(),
    slug: n.slug,
    visible: n.visible,
    en_menu: n.enMenu,
});

export const cambiosCategoriaAApi = (c: CambiosCategoria) => ({
    nombre: c.nombre.trim(),
    slug: c.slug,
    visible: c.visible,
    en_menu: c.enMenu,
});

export const moverCategoriaAApi = (padreId: string | null) => ({
    padre_id: aNumero(padreId),
});

export const ordenarCategoriasAApi = (
    websiteId: number,
    padreId: string | null,
    ids: string[],
) => ({
    website_id: websiteId,
    padre_id: aNumero(padreId),
    ids: ids.map(Number),
});

export const getArbolCategorias: GetArbolCategorias = async (websiteId) =>
    RestAPI.getLista<NodoCategoria, NodoCategoriaApi>(
        `${baseUrl}?website_id=${websiteId}`,
        nodoDesdeApi,
        "Error al cargar las categorías",
    );

export const postCategoria: PostCategoria = async (websiteId, padreId, nueva) => {
    const respuesta = await RestAPI.post(
        baseUrl,
        nuevaCategoriaAApi(websiteId, padreId, nueva),
        "Error al crear la categoría",
    );
    return String(respuesta.id);
};

export const patchCategoria: PatchCategoria = async (id, cambios) => {
    await RestAPI.patch(
        `${baseUrl}/${id}`,
        cambiosCategoriaAApi(cambios),
        "Error al guardar la categoría",
    );
};

export const patchMoverCategoria: PatchMoverCategoria = async (id, padreId) => {
    await RestAPI.patch(
        `${baseUrl}/${id}/mover`,
        moverCategoriaAApi(padreId),
        "Error al mover la categoría",
    );
};

export const patchOrdenarCategorias: PatchOrdenarCategorias = async (websiteId, padreId, ids) => {
    await RestAPI.patch(
        `${baseUrl}/ordenar`,
        ordenarCategoriasAApi(websiteId, padreId, ids),
        "Error al ordenar las categorías",
    );
};

export const deleteCategoria: DeleteCategoria = async (id) => {
    await RestAPI.delete(`${baseUrl}/${id}`, "Error al borrar la categoría");
};
