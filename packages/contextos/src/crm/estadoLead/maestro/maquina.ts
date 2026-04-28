import { Maquina } from "@olula/lib/diseño.js";
import { ContextoMaestroEstadosLead, EstadoMaestroEstadosLead } from "./diseño.ts";
import { EstadosLead, recargarEstadosLead } from "./maestro.ts";

export const getMaquina: () => Maquina<EstadoMaestroEstadosLead, ContextoMaestroEstadosLead> = () => {
    return {
        INICIAL: {
            estado_lead_cambiado: [EstadosLead.cambiar],

            estado_lead_seleccionado: [EstadosLead.activar],

            estado_lead_deseleccionado: EstadosLead.desactivar,

            estado_lead_marcado_defecto: (ctx) => recargarEstadosLead(ctx, ctx.estados_lead.criteria),

            estado_lead_borrado: EstadosLead.quitar,

            recarga_de_estados_lead_solicitada: recargarEstadosLead,

            criteria_cambiado: [EstadosLead.filtrar, recargarEstadosLead],

            creacion_de_estado_lead_solicitada: "CREANDO",
        },
        CREANDO: {
            creacion_estado_lead_cancelada: "INICIAL",

            estado_lead_creado: [EstadosLead.incluir, EstadosLead.activar, "INICIAL"],
        }
    }
}
