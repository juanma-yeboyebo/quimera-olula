import { Criteria, Entidad, Modelo, RespuestaLista } from "@olula/lib/diseño.ts";

export interface Caja extends Entidad {
    id: string;
    lpn: string;
    idUbicacion: string;
    ubicacion: string;
    idContenedor?: string | null;
}

export interface CajaMonoproducto extends Caja {
    sku: string | null;
    idLote: string | null;
    cantidad: number;
}

export interface MovimientoCaja extends Entidad {
    id: string;
    idLote: string;
    cantidad: string;
    fechaHora: Date;
    idUbicacion: string;
    ubicacion: string;
    concepto: string;
}

export interface MaterialCaja extends Entidad {
    id: string;
    sku: string;
    descripcion: string;
    cantidad: number;
    movimientos: MovimientoCaja[];
}

// Caja con su contenido completo (árbol de materiales + subcajas)
export interface CajaContenido extends Caja {
    contenido: ComponenteCaja[];
}

export type ComponenteCaja = CajaContenido | MaterialCaja;

// Caja monoproducto con su contenido (lista plana de materiales, sin subcajas anidadas)
export interface CajaMonoproductoContenido extends CajaMonoproducto {
    materiales: MaterialCaja[];
}

// Tipo de retorno del GET de detalle
export type CajaDetalle = CajaContenido | CajaMonoproductoContenido;

export interface NuevaCaja extends Modelo {
    idUbicacion: string;
    idTipoCaja: string;
    idContenedor?: string | null;
    sku?: string | null;
    idLote?: string | null;
    cantidad?: number | null;
}

export type CambiosCaja = Partial<Caja & Pick<CajaMonoproducto, "sku" | "idLote" | "cantidad">>;

export type GetCaja = (id: string) => Promise<CajaDetalle>;

export type GetCajas = (criteria: Criteria) => RespuestaLista<Caja>;

export type PostCaja = (nuevaCaja: NuevaCaja) => Promise<string>;

export type PatchCaja = (id: string, cambios: CambiosCaja) => Promise<void>;

export type DeleteCaja = (id: string) => Promise<void>;
