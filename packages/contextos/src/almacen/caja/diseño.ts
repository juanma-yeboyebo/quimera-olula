import { Entidad, Filtro, Orden, Paginacion, RespuestaLista } from "@olula/lib/diseño.ts";

export interface Caja extends Entidad {
    id: string;
    codigo_almacen: string;
}

export interface CajaAPI extends Entidad {
    id: string;
    codigo_almacen: string;
}

export interface MovimientoCaja {
    id: string;
    sku: string;
    descripcion: string;
    cantidad: number;
}

export type GetCaja = (id: string) => Promise<Caja>;
export type GetCajas = (
    filtro: Filtro,
    orden: Orden,
    paginacion?: Paginacion
) => RespuestaLista<Caja>;

export type PostCaja = (modulo: Partial<Caja>) => Promise<string>;
export type PatchCaja = (id: string, modulo: Partial<Caja>) => Promise<void>;
export type DeleteCaja = (id: string) => Promise<void>;

export type NuevaCaja = {
    id: string;
    codigo_almacen: string;
};

export type GetMovimientosCaja = (id: string) => RespuestaLista<MovimientoCaja>;