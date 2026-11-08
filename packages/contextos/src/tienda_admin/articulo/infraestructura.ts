import { RestAPI } from "@olula/lib/api/rest_api.ts";
import TiendaAdmin_Urls from "../comun/urls.ts";
import {
    ArticuloWeb,
    ArticuloWebDetalle,
    CambiosPublicacion,
    DeletePublicacion,
    GetArticulo,
    GetArticulos,
    PatchCategoriasArticulo,
    PatchPublicacion,
    PatchTextos,
    PublicacionArticulo,
    TextosArticulo,
} from "./diseño.ts";
import { criteriaArticulos } from "./dominio.ts";

const baseUrl = new TiendaAdmin_Urls().ARTICULO;

export interface ArticuloWebApi {
    referencia: string;
    descripcion: string;
    imagen: string | null;
    publicado: boolean;
    visible: boolean;
    destacado: boolean;
}

export interface PublicacionApi {
    website_id: number;
    publicado: boolean;
    visible: boolean;
    destacado: boolean;
    slug: string;
    orden: number;
    fecha_publicacion: string | null;
}

export interface ArticuloWebDetalleApi {
    referencia: string;
    descripcion: string;
    precio: number;
    descripcion_corta: string | null;
    descripcion_larga: string | null;
    meta_titulo: string | null;
    meta_descripcion: string | null;
    publicaciones: PublicacionApi[];
    imagenes: { id: number; url: string; alt: string | null; orden: number; principal: boolean }[];
    categorias: { id: number | string; nombre: string; ruta: string | string[] }[];
}

export const articuloDesdeApi = (a: ArticuloWebApi): ArticuloWeb => ({
    id: a.referencia,
    referencia: a.referencia,
    descripcion: a.descripcion,
    imagen: a.imagen ?? null,
    publicado: a.publicado,
    visible: a.visible,
    destacado: a.destacado,
});

export const publicacionDesdeApi = (p: PublicacionApi): PublicacionArticulo => ({
    websiteId: p.website_id,
    publicado: p.publicado,
    visible: p.visible,
    destacado: p.destacado,
    slug: p.slug ?? "",
    orden: p.orden,
    fechaPublicacion: p.fecha_publicacion ?? null,
});

export const articuloDetalleDesdeApi = (a: ArticuloWebDetalleApi): ArticuloWebDetalle => ({
    id: a.referencia,
    referencia: a.referencia,
    descripcion: a.descripcion,
    precio: a.precio,
    descripcionCorta: a.descripcion_corta ?? "",
    descripcionLarga: a.descripcion_larga ?? "",
    metaTitulo: a.meta_titulo ?? "",
    metaDescripcion: a.meta_descripcion ?? "",
    publicaciones: a.publicaciones.map(publicacionDesdeApi),
    imagenes: a.imagenes.map((i) => ({
        id: i.id,
        url: i.url,
        alt: i.alt ?? "",
        orden: i.orden,
        principal: i.principal,
    })),
    categorias: a.categorias.map((c) => ({
        id: String(c.id),
        nombre: c.nombre,
        ruta: Array.isArray(c.ruta) ? c.ruta.join(" › ") : c.ruta,
    })),
});

export const publicacionAApi = (c: CambiosPublicacion) => ({
    publicado: c.publicado,
    visible: c.visible,
    destacado: c.destacado,
    slug: c.slug,
    orden: Number(c.orden) || 0,
});

export const textosAApi = (t: TextosArticulo) => ({
    descripcion_corta: t.descripcionCorta,
    descripcion_larga: t.descripcionLarga,
    meta_titulo: t.metaTitulo,
    meta_descripcion: t.metaDescripcion,
});

export const categoriasAApi = (ids: string[]) => ({
    categorias: ids.map(Number),
});

const urlArticulo = (referencia: string) => `${baseUrl}/${encodeURIComponent(referencia)}`;

export const getArticulos: GetArticulos = async (filtros, criteria) =>
    RestAPI.getQuery<ArticuloWeb, ArticuloWebApi>(
        baseUrl,
        criteriaArticulos(filtros, criteria),
        articuloDesdeApi,
        "Error al cargar los artículos",
    );

export const getArticulo: GetArticulo = async (referencia) =>
    RestAPI.getItem<ArticuloWebDetalle, ArticuloWebDetalleApi>(
        urlArticulo(referencia),
        articuloDetalleDesdeApi,
        "Error al cargar el artículo",
    );

export const patchPublicacion: PatchPublicacion = async (referencia, websiteId, cambios) => {
    await RestAPI.patch(
        `${urlArticulo(referencia)}/publicacion/${websiteId}`,
        publicacionAApi(cambios),
        "Error al guardar la publicación",
    );
};

export const deletePublicacion: DeletePublicacion = async (referencia, websiteId) => {
    await RestAPI.delete(
        `${urlArticulo(referencia)}/publicacion/${websiteId}`,
        "Error al quitar la publicación",
    );
};

export const patchTextos: PatchTextos = async (referencia, textos) => {
    await RestAPI.patch(`${urlArticulo(referencia)}/textos`, textosAApi(textos), "Error al guardar los textos");
};

export const patchCategoriasArticulo: PatchCategoriasArticulo = async (referencia, ids) => {
    await RestAPI.patch(
        `${urlArticulo(referencia)}/categorias`,
        categoriasAApi(ids),
        "Error al guardar las categorías",
    );
};
