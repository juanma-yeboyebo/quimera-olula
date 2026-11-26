import { QError } from "@olula/lib/contexto.ts";
import { ClausulaFiltro, Criteria } from "@olula/lib/diseño.ts";
import { MetaModelo } from "@olula/lib/dominio.ts";
import { WebsiteAdmin } from "../comun/diseño.ts";
import { errorLongitud, errorSlug } from "../comun/dominio.ts";
import { NodoCategoria } from "../categoria/diseño.ts";
import { aplanarArbol } from "../categoria/dominio.ts";
import {
    ArticuloWeb,
    ArticuloWebDetalle,
    CambiosPublicacion,
    EstadoPublicacionFiltro,
    EstadoPublicacionWebsite,
    FilaPublicacion,
    FiltrosArticulo,
    FotoNoSubida,
    ImagenArticulo,
    LadoSoltarFoto,
    PublicacionArticulo,
    TextosArticulo,
} from "./diseño.ts";

export const MAXIMO_NOMBRE = 100;
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

export const estadoPublicacion = (p: PublicacionArticulo | undefined): EstadoPublicacionWebsite => {
    if (!p) return "Sin publicar";
    if (!p.publicado) return "En pausa";
    if (!p.visible) return "Oculto en catálogo";
    return "Publicado";
};

export const textoStock = (sinControlStock: boolean, stock: number): string =>
    sinControlStock ? "Sin control" : String(stock);

export const avisoStockArticulo = (a: ArticuloWeb): boolean => a.publicado && !a.sinControlStock && a.stock <= 0;

export const filasPublicacion = (a: ArticuloWebDetalle, websites: WebsiteAdmin[]): FilaPublicacion[] =>
    websites
        .filter((w) => w.activo)
        .map((website) => {
            const publicacion = publicacionDeWebsite(a, website.id);
            const stock = a.stocks.find((s) => s.websiteId === website.id)?.stock ?? 0;
            return {
                website,
                publicacion,
                estado: estadoPublicacion(publicacion),
                stock: textoStock(a.sinControlStock, stock),
            };
        });

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
        sinControlStock: a.sinControlStock,
        stock: a.stocks.find((s) => s.websiteId === websiteId)?.stock ?? 0,
    };
};

export const IDIOMA_POR_DEFECTO = "*";

export const AVISO_TEXTOS_IDIOMA = "Lo que dejes vacío se mostrará con el texto por defecto";

export const textosVacios: TextosArticulo = {
    nombre: "",
    descripcionCorta: "",
    descripcionLarga: "",
    metaTitulo: "",
    metaDescripcion: "",
};

export const textosDeArticulo = (a: ArticuloWebDetalle, idioma: string): TextosArticulo =>
    a.textos[idioma] ?? { ...textosVacios };

export const sugerenciasTextos = (a: ArticuloWebDetalle, idioma: string): TextosArticulo => {
    const porDefecto = textosDeArticulo(a, IDIOMA_POR_DEFECTO);
    if (idioma === IDIOMA_POR_DEFECTO) return { ...textosVacios, nombre: a.descripcion };
    return { ...porDefecto, nombre: porDefecto.nombre || a.descripcion };
};

export const opcionesIdioma = (idiomas: string[]): { valor: string; descripcion: string }[] => [
    { valor: IDIOMA_POR_DEFECTO, descripcion: "Por defecto" },
    ...idiomas.map((i) => ({ valor: i, descripcion: i })),
];

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
        nombre: {
            validacion: (m) => errorLongitud(m.nombre, MAXIMO_NOMBRE) ?? true,
        },
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

export const TIPOS_FOTO = "image/jpeg,image/png,image/webp";

export const textoProgresoSubida = (actual: number, total: number): string => `Subiendo ${actual} de ${total}`;

export const motivoError = (error: unknown): string => {
    const e = error as Partial<QError> & { message?: string };
    return e.descripcion || e.message || e.nombre || "Error desconocido";
};

export const errorFotosNoSubidas = (fallidas: FotoNoSubida[]): QError => ({
    nombre: fallidas.length === 1 ? "No se ha podido subir 1 foto" : `No se han podido subir ${fallidas.length} fotos`,
    descripcion: fallidas.map((f) => `${f.nombre}: ${f.motivo}`).join("\n"),
});

export const fotosEnOrden = (imagenes: ImagenArticulo[]): ImagenArticulo[] =>
    [...imagenes].sort((a, b) => a.orden - b.orden || a.id - b.id);

const colocar = (ids: number[], id: number, indice: number): number[] => {
    const sin = ids.filter((i) => i !== id);
    sin.splice(indice, 0, id);
    return sin;
};

const siCambia = (antes: number[], despues: number[]): number[] | null =>
    despues.every((id, k) => id === antes[k]) ? null : despues;

export const idsTrasMoverFoto = (imagenes: ImagenArticulo[], id: number, delta: -1 | 1): number[] | null => {
    const ids = fotosEnOrden(imagenes).map((i) => i.id);
    const destino = ids.indexOf(id) + delta;
    if (!ids.includes(id) || destino < 0 || destino >= ids.length) return null;
    return colocar(ids, id, destino);
};

export const idsTrasSoltarFoto = (
    imagenes: ImagenArticulo[],
    origenId: number,
    destinoId: number,
    lado: LadoSoltarFoto,
): number[] | null => {
    const ids = fotosEnOrden(imagenes).map((i) => i.id);
    if (origenId === destinoId || !ids.includes(origenId) || !ids.includes(destinoId)) return null;
    const indiceDestino = ids.filter((i) => i !== origenId).indexOf(destinoId);
    return siCambia(ids, colocar(ids, origenId, lado === "antes" ? indiceDestino : indiceDestino + 1));
};

export const ladoDeSoltado = (desplazamientoX: number, anchura: number): LadoSoltarFoto =>
    desplazamientoX < anchura / 2 ? "antes" : "despues";
