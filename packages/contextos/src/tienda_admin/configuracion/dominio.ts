import { MetaModelo } from "@olula/lib/dominio.ts";
import { CambiosConfiguracion, EdicionConfiguracion, WebsiteConfiguracion } from "./diseño.ts";

export const TEXTO_CONFIGURACION_PROXIMAMENTE = "Disponible próximamente";

export const seccionesProximamente: { titulo: string; campos: string[] }[] = [
    { titulo: "Envío gratis", campos: ["Importe mínimo"] },
    { titulo: "Aviso superior", campos: ["Texto del aviso"] },
    { titulo: "Menú", campos: ["Máximo en la barra", "En la barra con «Todas las categorías»"] },
];

export const edicionDeWebsite = (w: WebsiteConfiguracion): EdicionConfiguracion => ({
    tpvPuntoVentaId: w.tpvPuntoVentaId ?? "",
    tpvAgenteId: w.tpvAgenteId ?? "",
    usuarioNotificacionesId: w.usuarioNotificacionesId ?? "",
    nombreUsuarioNotificaciones: w.usuarioNotificacionesId ?? "",
});

export const metaEdicionConfiguracion: MetaModelo<EdicionConfiguracion> = {
    campos: {
        tpvPuntoVentaId: { tipo: "selector" },
        tpvAgenteId: { tipo: "selector" },
        usuarioNotificacionesId: {},
        nombreUsuarioNotificaciones: {},
    },
};

export const cambiosDeEdicion = (e: EdicionConfiguracion): CambiosConfiguracion => ({
    tpvPuntoVentaId: e.tpvPuntoVentaId || null,
    tpvAgenteId: e.tpvAgenteId || null,
    usuarioNotificacionesId: e.usuarioNotificacionesId || null,
});
