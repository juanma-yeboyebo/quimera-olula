import { RestAPI } from "@olula/lib/api/rest_api.ts";
import {
    CambiosConfiguracion,
    GetWebsiteConfiguracion,
    PatchWebsiteConfiguracion,
    WebsiteConfiguracion,
} from "./diseño.ts";

const baseUrl = "/tienda_admin/website";

export interface WebsiteConfiguracionApi {
    id: number;
    codigo: string;
    nombre: string;
    tpv_punto_venta_id: string | null;
    tpv_agente_id: string | null;
    usuario_notificaciones_id: string | null;
}

export const websiteConfiguracionDesdeApi = (api: WebsiteConfiguracionApi): WebsiteConfiguracion => ({
    id: api.id,
    codigo: api.codigo,
    nombre: api.nombre,
    tpvPuntoVentaId: api.tpv_punto_venta_id,
    tpvAgenteId: api.tpv_agente_id,
    usuarioNotificacionesId: api.usuario_notificaciones_id,
});

export const cambiosConfiguracionAApi = (c: CambiosConfiguracion) => ({
    tpv_punto_venta_id: c.tpvPuntoVentaId,
    tpv_agente_id: c.tpvAgenteId,
    usuario_notificaciones_id: c.usuarioNotificacionesId,
});

export const getWebsiteConfiguracion: GetWebsiteConfiguracion = async (id) =>
    RestAPI.getItem<WebsiteConfiguracion, WebsiteConfiguracionApi>(
        `${baseUrl}/${id}`,
        websiteConfiguracionDesdeApi,
        "Error al cargar la configuración de la tienda",
    );

export const patchWebsiteConfiguracion: PatchWebsiteConfiguracion = async (id, cambios) => {
    await RestAPI.patch(
        `${baseUrl}/${id}`,
        cambiosConfiguracionAApi(cambios),
        "Error al guardar la configuración de la tienda",
    );
};
