import { RestAPI } from "@olula/lib/api/rest_api.ts";
import { GetWebsites, WebsiteAdmin } from "./diseño.ts";
import TiendaAdmin_Urls from "./urls.ts";

const urls = new TiendaAdmin_Urls();

export interface WebsiteAdminApi {
    id: number;
    codigo: string;
    nombre: string;
    activo: boolean;
}

export const websiteDesdeApi = (w: WebsiteAdminApi): WebsiteAdmin => ({
    id: w.id,
    codigo: w.codigo,
    nombre: w.nombre,
    activo: w.activo,
});

export const getWebsites: GetWebsites = async () =>
    RestAPI.getLista<WebsiteAdmin, WebsiteAdminApi>(
        urls.WEBSITE,
        websiteDesdeApi,
        "Error al cargar los websites",
    );
