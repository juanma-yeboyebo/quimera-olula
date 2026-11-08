import { ClausulaFiltro, Criteria } from "@olula/lib/diseño.ts";
import { MetaModelo } from "@olula/lib/dominio.ts";
import { errorLongitud, errorSlug } from "../comun/dominio.ts";
import { NodoCategoria } from "../categoria/diseño.ts";
import { aplanarArbol } from "../categoria/dominio.ts";
import {
    ArticuloWeb,
    ArticuloWebDetalle,
    CambiosPublicacion,
    EstadoPublicacionFiltro,
    FiltrosArticulo,
    PublicacionArticulo,
    TextosArticulo,
} from "./diseño.ts";

export const MAXIMO_DESCRIPCION_CORTA = 255;
export const MAXIMO_META_TITULO = 255;
export const MAXIMO_META_DESCRIPCION = 500;

export const opcionesEstadoFiltro: { valor: EstadoPublicacionFiltro; descripcion: string }[] = [
    { valor: "todos", descripcion: "Todos" },
    { valor: "publicado", descripcion: "Publicados" },
    { valor: "no_publicado", descripcion: "No publicados" },
];

export const filtrosArticuloIniciales: FiltrosArticulo = {
    websiteId: null,
    texto: "",
    estado: "todos",
    categoriaId: null,
};

export const filtroArticulos = (f: FiltrosArticulo): ClausulaFiltro[] => {
    const filtro: ClausulaFiltro[] = [];
    if (f.websiteId !== null) filtro.push(["website_id", "=", String(f.websiteId)]);
    if (f.texto.trim() !== "") filtro.push(["texto", "~", f.texto.trim()]);
    if (f.estado !== "todos") filtro.push(["estado", "=", f.estado]);
    if (f.categoriaId !== null) filtro.push(["categoria_id", "=", f.categoriaId]);
    return filtro;
};

export const criteriaArticulos = (f: FiltrosArticulo, criteria: Criteria): Criteria => ({
    filtro: filtroArticulos(f),
    orden: criteria.orden,
    paginacion: criteria.paginacion,
});

export const distintivosArticulo = (a: ArticuloWeb): string[] => [
    a.publicado ? "Publicado" : "No publicado",
    ...(a.publicado && !a.visible ? ["Oculto"] : []),
    ...(a.destacado ? ["Destacado"] : []),
];

export const publicacionDeWebsite = (
    a: ArticuloWebDetalle,
    websiteId: number | null,
): PublicacionArticulo | undefined =>
    websiteId === null ? undefined : a.publicaciones.find((p) => p.websiteId === websiteId);

export const cambiosDePublicacion = (p: PublicacionArticulo | undefined): CambiosPublicacion =>
    p
        ? { publicado: p.publicado, visible: p.visible, destacado: p.destacado, slug: p.slug, orden: p.orden }
        : { publicado: true, visible: true, destacado: false, slug: "", orden: 0 };

export const textoBotonPublicacion = (
    p: PublicacionArticulo | undefined,
    nombreWebsite: string | null,
): string => (p ? "Guardar" : `Publicar en ${nombreWebsite ?? "la tienda"}`);

export const textoQuitarPublicacion = (nombreWebsite: string | null): string =>
    `Quitar de ${nombreWebsite ?? "la tienda"}`;

export const resumenDeArticulo = (a: ArticuloWebDetalle, websiteId: number | null): ArticuloWeb => {
    const p = publicacionDeWebsite(a, websiteId);
    const principal = a.imagenes.find((i) => i.principal) ?? a.imagenes[0];
    return {
        id: a.id,
        referencia: a.referencia,
        descripcion: a.descripcion,
        imagen: principal ? principal.url : null,
        publicado: p?.publicado ?? false,
        visible: p?.visible ?? false,
        destacado: p?.destacado ?? false,
    };
};

export const textosDeArticulo = (a: ArticuloWebDetalle): TextosArticulo => ({
    descripcionCorta: a.descripcionCorta,
    descripcionLarga: a.descripcionLarga,
    metaTitulo: a.metaTitulo,
    metaDescripcion: a.metaDescripcion,
});

export const metaPublicacion: MetaModelo<CambiosPublicacion> = {
    campos: {
        publicado: { tipo: "checkbox" },
        visible: { tipo: "checkbox" },
        destacado: { tipo: "checkbox" },
        slug: { validacion: (m) => errorSlug(m.slug) ?? true },
        orden: { tipo: "entero" },
    },
};

export const metaTextos: MetaModelo<TextosArticulo> = {
    campos: {
        descripcionCorta: {
            validacion: (m) => errorLongitud(m.descripcionCorta, MAXIMO_DESCRIPCION_CORTA) ?? true,
        },
        descripcionLarga: {},
        metaTitulo: {
            validacion: (m) => errorLongitud(m.metaTitulo, MAXIMO_META_TITULO) ?? true,
        },
        metaDescripcion: {
            validacion: (m) => errorLongitud(m.metaDescripcion, MAXIMO_META_DESCRIPCION) ?? true,
        },
    },
};

export const idsCategoriasEnOrden = (arbol: NodoCategoria[], marcadas: Iterable<string>): string[] => {
    const conjunto = new Set(marcadas);
    return aplanarArbol(arbol)
        .map((p) => p.nodo.id)
        .filter((id) => conjunto.has(id));
};

export const idsCategoriasDeArticulo = (a: ArticuloWebDetalle): string[] => a.categorias.map((c) => c.id);

export const mismasCategorias = (a: string[], b: string[]): boolean =>
    a.length === b.length && [...a].sort().join(",") === [...b].sort().join(",");

export const opcionesFiltroCategoria = (arbol: NodoCategoria[]): { valor: string; descripcion: string }[] => [
    { valor: "", descripcion: "Todas las categorías" },
    ...aplanarArbol(arbol).map((p) => ({
        valor: p.nodo.id,
        descripcion: `${"  ".repeat(p.profundidad)}${p.nodo.nombre}`,
    })),
];

export const enlaceArticuloErp = (referencia: string): string =>
    `/ventas/articulo?id=${encodeURIComponent(referencia)}`;
