import { Maquina } from "@olula/lib/diseño.js";
import { publicar } from "@olula/lib/dominio.js";
import { cambiarEstadoLead, cargarContexto, getContextoVacio, marcarPorDefecto } from "./detalle.ts";
import { ContextoDetalleEstadoLead, EstadoDetalleEstadoLead } from "./diseño.ts";

export const getMaquina: () => Maquina<EstadoDetalleEstadoLead, ContextoDetalleEstadoLead> = () => {
    return {
        INICIAL: {
            estado_lead_id_cambiado: cargarContexto,

            estado_lead_cambiado: cambiarEstadoLead,

            marcar_estado_lead_por_defecto: marcarPorDefecto,

            edicion_estado_lead_cancelada: [getContextoVacio, publicar("estado_lead_deseleccionado", null)],

            borrado_estado_lead_solicitado: "BORRANDO",
        },
        BORRANDO: {
            borrado_estado_lead_cancelado: "INICIAL",

            estado_lead_borrado: [getContextoVacio, publicar('estado_lead_borrado', (_, estadoLeadId) => estadoLeadId)],
        },
    }
}
