import { Criteria, Entidad, Modelo, RespuestaLista } from "@olula/lib/diseño.ts";

export interface ArticuloProveedor extends Entidad {
    id: string;
    articuloId: string;
    articulo: string;
    proveedorId: string;
    proveedor: string;
    nombre: string;
    coste: number;
    divisaId: string;
    dto: number;
    refProveedor: string;
    plazo: number | null;
    uniEmbalaje: number | null;
    requiereEmbalajes: boolean;
    porDefecto: boolean;
}

export interface NuevoArticuloProveedor extends Modelo {
    articuloId: string;
    proveedorId: string;
    proveedor: string;
    nombre: string;
    coste: number;
    divisaId: string;
    dto: number;
    refProveedor: string;
    plazo: number | null;
    uniEmbalaje: number | null;
    requiereEmbalajes: boolean;
}

export type CambiosArticuloProveedor = Partial<
    Pick<
        ArticuloProveedor,
        | "nombre"
        | "coste"
        | "divisaId"
        | "dto"
        | "refProveedor"
        | "plazo"
        | "uniEmbalaje"
        | "requiereEmbalajes"
    >
>;

export type GetArticuloProveedor = (id: string) => Promise<ArticuloProveedor>;

export type GetProveedoresDeArticulo = (
    articuloId: string
) => RespuestaLista<ArticuloProveedor>;

export type GetArticulosDeProveedor = (
    proveedorId: string,
    criteria: Criteria
) => RespuestaLista<ArticuloProveedor>;

export type PostArticuloProveedor = (
    nuevo: NuevoArticuloProveedor
) => Promise<string>;

export type PatchArticuloProveedor = (
    id: string,
    cambios: CambiosArticuloProveedor
) => Promise<void>;

export type DeleteArticuloProveedor = (id: string) => Promise<void>;

export type MarcarPorDefectoArticuloProveedor = (id: string) => Promise<void>;
