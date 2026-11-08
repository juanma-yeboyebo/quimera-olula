import { Criteria, Entidad, Modelo, RespuestaLista } from "@olula/lib/diseño.ts";

export type EstadoPublicacionFiltro = "publicado" | "no_publicado" | "todos";

export interface ArticuloWeb extends Entidad {
    id: string;
    referencia: string;
    descripcion: string;
    imagen: string | null;
    publicado: boolean;
    visible: boolean;
    destacado: boolean;
}

export interface PublicacionArticulo {
    websiteId: number;
    publicado: boolean;
    visible: boolean;
    destacado: boolean;
    slug: string;
    orden: number;
    fechaPublicacion: string | null;
}

export interface ImagenArticulo {
    id: number;
    url: string;
    alt: string;
    orden: number;
    principal: boolean;
}

export interface CategoriaArticulo {
    id: string;
    nombre: string;
    ruta: string;
}

export interface ArticuloWebDetalle extends Entidad {
    id: string;
    referencia: string;
    descripcion: string;
    precio: number;
    descripcionCorta: string;
    descripcionLarga: string;
    metaTitulo: string;
    metaDescripcion: string;
    publicaciones: PublicacionArticulo[];
    imagenes: ImagenArticulo[];
    categorias: CategoriaArticulo[];
}

export interface TextosArticulo extends Modelo {
    descripcionCorta: string;
    descripcionLarga: string;
    metaTitulo: string;
    metaDescripcion: string;
}

export interface CambiosPublicacion extends Modelo {
    publicado: boolean;
    visible: boolean;
    destacado: boolean;
    slug: string;
    orden: number;
}

export interface FiltrosArticulo {
    websiteId: number | null;
    texto: string;
    estado: EstadoPublicacionFiltro;
    categoriaId: string | null;
}

export type GetArticulos = (filtros: FiltrosArticulo, criteria: Criteria) => RespuestaLista<ArticuloWeb>;
export type GetArticulo = (referencia: string) => Promise<ArticuloWebDetalle>;
export type PatchPublicacion = (
    referencia: string,
    websiteId: number,
    cambios: CambiosPublicacion,
) => Promise<void>;
export type DeletePublicacion = (referencia: string, websiteId: number) => Promise<void>;
export type PatchTextos = (referencia: string, textos: TextosArticulo) => Promise<void>;
export type PatchCategoriasArticulo = (referencia: string, ids: string[]) => Promise<void>;
