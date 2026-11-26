import { Entidad, Modelo } from "@olula/lib/diseño.ts";

export type TipoFormaPagoTienda = "PASARELA" | "SIN_PASARELA";

export type DestinoFormaPagoTienda = "PEDIDO" | "VENTA_TPV";

export interface CuentaStripe {
    id: string;
    nombre: string;
}

export interface ConexionFormaPago {
    modo: string;
    test: boolean;
    live: boolean;
}

export interface FormaPagoTienda extends Entidad {
    id: string;
    websiteId: number;
    codigo: string;
    nombre: string;
    descripcion: string;
    tipo: TipoFormaPagoTienda;
    codpago: string;
    orden: number;
    activo: boolean;
    credencial: CuentaStripe | null;
    destino: DestinoFormaPagoTienda;
    recibosPagados: boolean;
}

export interface FormaPagoTiendaDetalle extends FormaPagoTienda {
    conexion: ConexionFormaPago | null;
}

export interface NuevaFormaPagoTienda extends Modelo {
    tipo: TipoFormaPagoTienda;
    codigo: string;
    nombre: string;
    descripcion: string;
    codpago: string;
    credencialId: string;
    destino: DestinoFormaPagoTienda;
    recibosPagados: boolean;
}

export interface EdicionFormaPagoTienda extends Modelo {
    nombre: string;
    descripcion: string;
    codpago: string;
    credencialId: string;
    orden: number;
    activo: boolean;
    destino: DestinoFormaPagoTienda;
    recibosPagados: boolean;
}

export interface CambiosFormaPagoTienda {
    nombre?: string;
    descripcion?: string | null;
    codpago?: string;
    credencialId?: string | null;
    orden?: number;
    activo?: boolean;
    destino?: DestinoFormaPagoTienda;
    recibosPagados?: boolean;
}

export type GetFormasPago = (websiteId: number) => Promise<FormaPagoTienda[]>;

export type GetFormaPago = (id: string) => Promise<FormaPagoTiendaDetalle>;

export type PostFormaPago = (websiteId: number, nueva: NuevaFormaPagoTienda) => Promise<string>;

export type PatchFormaPago = (id: string, cambios: CambiosFormaPagoTienda) => Promise<void>;

export type PostProbarConexion = (id: string) => Promise<void>;

export type GetCuentasStripe = () => Promise<CuentaStripe[]>;
