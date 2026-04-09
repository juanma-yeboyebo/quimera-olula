import { Filtro, Orden, Paginacion, RespuestaLista } from "@olula/lib/diseño.ts";
import { ListaActivaEntidades } from "@olula/lib/ListaActivaEntidades.js";
import { CambioClienteVenta, ClienteVenta, LineaVenta, NuevaLineaVenta, Venta } from "../venta/diseño.ts";

export interface Factura extends Venta {
    cliente: ClienteVenta;
    editable?: boolean;
    lineas?: LineaFactura[];
}
export interface LineaFactura extends LineaVenta {
    otro_campo?: string;
}

export type NuevaFactura = {
    cliente_id?: string;
    nombre_cliente?: string;
    id_fiscal?: string;
    tipo_via?: string;
    nombre_via?: string;
    numero?: string;
    otros?: string;
    cod_postal?: string;
    ciudad?: string;
    provincia_id?: string;
    pais_id?: string;
    apartado?: string;
    telefono?: string;
    empresa_id: string;
};;

export type CambioClienteFactura = CambioClienteVenta;

export type NuevaLineaFactura = NuevaLineaVenta;

export type GetFacturas = (filtro: Filtro, orden: Orden, paginacion: Paginacion) => RespuestaLista<Factura>;

export type GetFactura = (id: string) => Promise<Factura>;

export type GetLineasFactura = (id: string) => Promise<LineaFactura[]>;

export type GetReportFactura = (id: string) => Promise<Blob>;

export type PostFactura = (factura: NuevaFactura) => Promise<string>;

export type PostLinea = (id: string, linea: NuevaLineaVenta) => Promise<string>;

export type PatchFactura = (id: string, factura: Factura) => Promise<void>;

export type PatchClienteFactura = (id: string, cambio: CambioClienteFactura) => Promise<void>;

export type PatchLinea = (id: string, linea: LineaFactura) => Promise<void>;

export type PatchArticuloLinea = (id: string, lineaId: string, referencia: string) => Promise<void>;

export type PatchCantidadLinea = (id: string, linea: LineaFactura, cantidad: number) => Promise<void>;

export type DeleteLinea = (id: string, lineaId: string) => Promise<void>;


export type EstadoFactura = (
    'INICIAL'
    | 'ABIERTO'
    | 'BORRANDO_FACTURA'
    | 'CAMBIANDO_CLIENTE'
    | 'CAMBIANDO_DESCUENTO'
    | 'CREANDO_LINEA'
    | 'CAMBIANDO_LINEA'
    | 'BORRANDO_LINEA'
);

export type EstadoMaestroFactura = (
    'INICIAL' | 'CREANDO_FACTURA'
);

export type ContextoFactura = {
    estado: EstadoFactura;
    factura: Factura;
    facturaInicial: Factura;
    lineaActiva: LineaFactura | null;
};

export type ContextoMaestroFactura = {
    estado: EstadoMaestroFactura;
    facturas: ListaActivaEntidades<Factura>;
};

export type ClienteFacturaRegistrado = {
    id: string,
}