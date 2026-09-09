import { Direccion, Filtro, Orden, Paginacion, RespuestaLista } from "@olula/lib/diseño.ts";
import { ListaActivaEntidades } from "@olula/lib/ListaActivaEntidades.js";
import { ListaEntidades } from "@olula/lib/ListaEntidades.js";
import { LineaVenta, Venta } from "#/ventas/venta/diseño.ts";
import { CambioCliente } from "#/ventas/comun/componentes/moleculas/CambioClienteVenta/diseño.ts";

export interface ClienteVentaTpv {
    id: string | null;
    nombre: string;
    idFiscal: string;
    idDireccion: string | null;
    direccion: Direccion;
}

// Venta TPV de El Ganso: además de los campos genéricos, trae email y
// tarjeta de fidelización Gansociety (ver ficha de comanda en Eneboo), el
// estado real de tpv_comandas y punto de venta/agente resueltos por el
// backend a partir del usuario logueado.
export interface VentaTpv extends Venta {
    cliente: ClienteVentaTpv | null;
    pendiente: number;
    pagado: number;
    puntoVentaId: string;
    puntoVenta: string;
    abierta: boolean;
    estado: string;
    hora?: string;
    email?: string;
    tarjetaPuntosId?: string;
    codtienda?: string;
    codalmacen?: string;
    lineas: LineaVentaTpv[];
}

// barcode/talla/color: código de barras real de la variante talla+color
// vendida y sus valores (tabla atributosarticulos). El barcode se usa para
// detectar re-escaneos del mismo artículo y sumar cantidad en vez de crear
// otra línea; talla/color son solo para mostrar.
export interface LineaVentaTpv extends LineaVenta {
    barcode?: string;
    talla?: string;
    color?: string;
}

export interface CambiosDatosCliente {
    email: string;
    tarjeta_puntos_id: string;
    [key: string]: unknown;
}

export type NuevaVentaTpv = {
    agente_id: string;
    punto_venta_id: string;
};

// Pago real de la venta (efectivo/tarjeta) — vale/saldoVale se tipan por si
// hay pagos históricos sincronizados con vale, aunque esta fase no crea
// pagos con vale desde la UI (ver PendienteVenta).
export interface PagoVentaTpv {
    id: string;
    importe: number;
    formaPago: string;
    fecha: Date;
    idArqueo: string;
    arqueoAbierto: boolean;
    idTipoTarjeta: string | null;
    vale?: string | null;
    saldoVale?: number | null;
    [key: string]: unknown;
}

export type NuevoPagoVentaTpv = {
    importe: number;
    formaPago: 'EFECTIVO' | 'TARJETA';
    idTipoTarjeta?: string | null;
};

export type GetVentasTpv = (filtro: Filtro, orden: Orden, paginacion: Paginacion) => RespuestaLista<VentaTpv>;

export type GetVentaTpv = (id: string) => Promise<VentaTpv>;

export type GetLineasVentaTpv = (id: string) => Promise<LineaVentaTpv[]>;

export type PostVentaTpv = (venta: NuevaVentaTpv) => Promise<string>;

export type PatchClienteVentaTpv = (id: string, cambio: CambioCliente) => Promise<void>;

export type PatchLinea = (id: string, linea: LineaVentaTpv) => Promise<void>;

export type PatchCantidadLinea = (id: string, linea: LineaVentaTpv, cantidad: number) => Promise<void>;

export type DeleteLinea = (id: string, lineaId: string) => Promise<void>;

export type PostPago = (id: string, pago: NuevoPagoVentaTpv) => Promise<string>;

export type DeletePago = (id: string, idPago: string) => Promise<void>;

export type GetPagosVentaTpv = (id: string) => Promise<PagoVentaTpv[]>;

export type EstadoVentaTpv = (
    'INICIAL' | 'ABIERTO' | 'SERVIDO'
    | 'BORRANDO_VENTA'
    | 'CAMBIANDO_DESCUENTO'
    | 'CREANDO_LINEA' | 'BORRANDO_LINEA' | 'CAMBIANDO_LINEA'
    | 'AÑADIENDO_BOLSAS'
    | 'PAGANDO_EN_EFECTIVO' | 'PAGANDO_CON_TARJETA' | 'BORRANDO_PAGO'
);

export type EstadoMaestroVentaTpv = (
    'INICIAL' | 'CREANDO_VENTA'
);

export type ContextoVentaTpv<T extends VentaTpv = VentaTpv> = {
    estado: EstadoVentaTpv;
    venta: T;
    ventaInicial: T;
    lineaActiva: LineaVentaTpv | null;
    pagos: ListaEntidades<PagoVentaTpv>;
};

export type ContextoMaestroVentaTpv = {
    estado: EstadoMaestroVentaTpv;
    ventas: ListaActivaEntidades<VentaTpv>;
    seleccionados: string[];
};
