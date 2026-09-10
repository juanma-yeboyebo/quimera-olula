import { Criteria, Entidad, RespuestaLista } from "@olula/lib/diseño.ts";

export interface ReciboCompra extends Entidad {
    id: string;
    facturaId: string | null;
    codigo: string;
    fechaEmision: Date | null;
    fechaVencimiento: Date | null;
    estado: string;
    importe: number;
    proveedorId: string | null;
    nombreProveedor: string;
    idFiscal: string;
}

export type GetReciboCompra = (id: string) => Promise<ReciboCompra>;

export type GetRecibosCompra = (criteria: Criteria) => RespuestaLista<ReciboCompra>;
