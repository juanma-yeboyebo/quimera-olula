import { Modelo } from "@olula/lib/diseño.ts";

export interface WebsiteConfiguracion {
    id: number;
    codigo: string;
    nombre: string;
    tpvPuntoVentaId: string | null;
    tpvAgenteId: string | null;
    usuarioNotificacionesId: string | null;
}

export interface EdicionConfiguracion extends Modelo {
    tpvPuntoVentaId: string;
    tpvAgenteId: string;
    usuarioNotificacionesId: string;
    nombreUsuarioNotificaciones: string;
}

export interface CambiosConfiguracion {
    tpvPuntoVentaId: string | null;
    tpvAgenteId: string | null;
    usuarioNotificacionesId: string | null;
}

export type GetWebsiteConfiguracion = (id: number) => Promise<WebsiteConfiguracion>;

export type PatchWebsiteConfiguracion = (id: number, cambios: CambiosConfiguracion) => Promise<void>;
