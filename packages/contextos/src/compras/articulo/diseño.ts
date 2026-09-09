import { Criteria, Entidad, RespuestaLista } from "@olula/lib/diseño.ts";

export interface Articulo extends Entidad {
    id: string;
    descripcion: string;
    observaciones: string;
    grupoIvaProductoId: string;
    noStock: boolean;
    seCompra: boolean;
}

/**
 * Pendiente del endpoint de precios por proveedor (siguiente entrega).
 */
export interface PrecioProveedorArticulo extends Entidad {
    id: string;
    proveedorId: string;
    proveedorNombre: string;
    referenciaProveedor: string;
    coste: number;
    descuento: number;
    plazoEntrega: number;
    unidadesEmbalaje: number;
    porDefecto: boolean;
}

export type CambiosArticulo = Partial<
    Pick<Articulo, "descripcion" | "observaciones" | "grupoIvaProductoId">
>;

export type PostArticulo = (articulo: Partial<Articulo>) => Promise<string>;

export type GetArticulo = (id: string) => Promise<Articulo>;

export type GetArticulos = (criteria: Criteria) => RespuestaLista<Articulo>;

export type PatchArticulo = (id: string, cambios: CambiosArticulo) => Promise<void>;
