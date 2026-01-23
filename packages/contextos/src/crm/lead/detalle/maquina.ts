import { Maquina } from "@olula/lib/diseño.js";
import { publicar } from "@olula/lib/dominio.js";
import { cambiarLead, cargarContexto, getContextoVacio, onLeadBorrado } from "./detalle.ts";
import { ContextoDetalleLead, EstadoDetalleLead } from "./diseño.ts";

export const getMaquina: () => Maquina<EstadoDetalleLead, ContextoDetalleLead> = () => {
    return {
        INICIAL: {
            lead_id_cambiado: cargarContexto,

            lead_cambiado: cambiarLead,

            edicion_lead_cancelada: [getContextoVacio, publicar("lead_deseleccionado", null)],

            borrado_lead_solicitado: "BORRANDO",

            creacion_oportunidad_solicitada: "CREANDO_OPORTUNIDAD",

            borrado_oportunidad_solicitado: "BORRANDO_OPORTUNIDAD",

            creacion_accion_solicitada: "CREANDO_ACCION",

            borrado_accion_solicitado: "BORRANDO_ACCION",
        },
        BORRANDO: {
            borrado_lead_cancelado: "INICIAL",

            lead_borrado: onLeadBorrado,
        },
        CREANDO_OPORTUNIDAD: {
            creacion_oportunidad_cancelada: "INICIAL",
        },
        BORRANDO_OPORTUNIDAD: {
            borrado_oportunidad_cancelado: "INICIAL",
        },
        CREANDO_ACCION: {
            creacion_accion_cancelada: "INICIAL",
        },
        BORRANDO_ACCION: {
            borrado_accion_cancelado: "INICIAL",
        },
    }
}
