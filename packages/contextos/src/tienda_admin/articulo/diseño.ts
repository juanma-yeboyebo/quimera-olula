import { Criteria, Entidad, Modelo, RespuestaLista } from "@olula/lib/diseño.ts";
import { WebsiteAdmin } from "../comun/diseño.ts";

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
    textos: Record<string, TextosArticulo>;
    idiomas: string[];
    publicaciones: PublicacionArticulo[];
    imagenes: ImagenArticulo[];
    categorias: CategoriaArticulo[];
}

export interface TextosArticulo extends Modelo {
    nombre: string;
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

export type EstadoPublicacionWebsite = "Sin publicar" | "En pausa" | "Oculto en catálogo" | "Publicado";

export interface FilaPublicacion {
    website: WebsiteAdmin;
    publicacion: PublicacionArticulo | undefined;
    estado: EstadoPublicacionWebsite;
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
export type PatchTextos = (referencia: string, idioma: string, textos: TextosArticulo) => Promise<void>;
export type PatchCategoriasArticulo = (referencia: string, ids: string[]) => Promise<void>;
export type PostImagenArticulo = (referencia: string, fichero: File) => Promise<void>;
export type DeleteImagenArticulo = (referencia: string, id: number) => Promise<void>;
export type PatchOrdenImagenes = (referencia: string, ids: number[]) => Promise<void>;
export type PatchImagenPrincipal = (referencia: string, id: number) => Promise<void>;
export type LadoSoltarFoto = "antes" | "despues";

export interface FotoNoSubida {
    nombre: string;
    motivo: string;
}
