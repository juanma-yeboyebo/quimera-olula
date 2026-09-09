import { TipoCodBarras } from "#/valores/codbarras.ts";
import { Entidad, Filtro, Orden, Paginacion } from "@olula/lib/diseño.ts";

export interface Articulo extends Entidad {
    id: string;
    descripcion: string;
    codbarras: string;
    tipoCodBarras: TipoCodBarras | "";
    observaciones: string;
    precio: number;
    grupoIvaProductoId: string;
    pvpVariable: boolean;
    noStock: boolean;
}

export interface TagArticulo extends Entidad {
    id: string;
    descripcion: string;
    precio: number;
    grupoIvaProductoId: string;
    codbarras: string;
}

export type CambiosArticulo = Partial<
    Pick<
        Articulo,
        | "descripcion"
        | "codbarras"
        | "tipoCodBarras"
        | "observaciones"
        | "precio"
        | "grupoIvaProductoId"
    >
>;

export type GetArticulo = (id: string) => Promise<Articulo>;

export type GetArticulos = (
    filtro: Filtro,
    orden: Orden,
    paginacion?: Paginacion
) => Promise<Articulo[]>;

export type GetTagsArticulo = (filtro: Filtro, orden: Orden) => Promise<TagArticulo[]>;

export type PatchArticulo = (id: string, cambios: CambiosArticulo) => Promise<void>;
