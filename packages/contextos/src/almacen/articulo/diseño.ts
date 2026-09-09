import { Entidad, Filtro, Orden, Paginacion, RespuestaLista } from "@olula/lib/diseño.ts";

export interface ArticuloAlmacen extends Entidad {
    id: string;
    descripcion: string;
};

export interface Articulo extends Entidad {
    id: string;
    descripcion: string;
    observaciones: string;
    noStock: boolean;
    seCompra: boolean;
    seVende: boolean;
};

export interface ArticuloAPI extends Entidad {
    id: string;
    descripcion: string;
    observaciones: string | null;
    no_stock: boolean;
    se_compra: boolean;
    se_vende: boolean;
};

export interface SkuLote {
    id: string;
    descripcion: string;
    loteId: string | null;
};

export type GetArticulo = (id: string) => Promise<Articulo>;
export type GetArticulos = (
    filtro: Filtro,
    orden: Orden,
    paginacion?: Paginacion
) => RespuestaLista<Articulo>;
export type LeerCodBarras = (codigo: string) => Promise<SkuLote>;

export type PostArticulo = (Articulo: Partial<Articulo>) => Promise<string>;
export type DeleteArticulo = (id: string) => Promise<void>;
