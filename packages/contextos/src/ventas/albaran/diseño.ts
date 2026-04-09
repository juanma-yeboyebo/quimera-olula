import { Filtro, Orden, Paginacion, RespuestaLista } from "@olula/lib/diseño.ts";
import { ListaActivaEntidades } from "@olula/lib/ListaActivaEntidades.js";
import { CambioClienteVenta, ClienteVenta, LineaVenta, NuevaLineaVenta, NuevaVenta, Venta } from "../venta/diseño.ts";

export interface Albaran extends Venta {
    cliente: ClienteVenta;
    idfactura: string | null;
    lineas: LineaAlbaran[];
}

export interface LineaAlbaran extends LineaVenta {
    otro_campo?: string;
}

export type NuevoAlbaran = NuevaVenta;

export type CambioClienteAlbaran = CambioClienteVenta;

export type NuevaLineaAlbaran = NuevaLineaVenta;

export type GetAlbaranes = (filtro: Filtro, orden: Orden, paginacion: Paginacion) => RespuestaLista<Albaran>;

export type GetAlbaran = (id: string) => Promise<Albaran>;

export type GetLineasAlbaran = (id: string) => Promise<LineaAlbaran[]>;

export type PostAlbaran = (albaran: NuevoAlbaran) => Promise<string>;

export type PostLinea = (id: string, linea: NuevaLineaVenta) => Promise<string>;

export type PatchAlbaran = (id: string, albaran: Albaran) => Promise<void>;

export type PatchClienteAlbaran = (id: string, cambio: CambioClienteAlbaran) => Promise<void>;

export type PatchLinea = (id: string, linea: LineaAlbaran) => Promise<void>;

export type PatchArticuloLinea = (id: string, lineaId: string, referencia: string) => Promise<void>;

export type PatchCantidadLinea = (id: string, linea: LineaAlbaran, cantidad: number) => Promise<void>;

export type DeleteLinea = (id: string, lineaId: string) => Promise<void>;

export type EstadoAlbaran = (
    'INICIAL' | 'ABIERTO' | 'FACTURADO'
    | 'BORRANDO_ALBARAN'
    | 'CAMBIANDO_CLIENTE'
    | 'CAMBIANDO_DESCUENTO'
    | 'CREANDO_LINEA' | 'BORRANDO_LINEA' | 'CAMBIANDO_LINEA'
);

export type EstadoMaestroAlbaran = ('INICIAL' | 'CREANDO_ALBARAN');

export type ContextoAlbaran = {
    estado: EstadoAlbaran;
    albaran: Albaran;
    albaranInicial: Albaran;
    lineaActiva: LineaAlbaran | null;
};

export type ContextoMaestroAlbaran = {
    estado: EstadoMaestroAlbaran;
    albaranes: ListaActivaEntidades<Albaran>;
};
