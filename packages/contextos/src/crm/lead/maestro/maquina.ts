import { Maquina } from "@olula/lib/diseño.js";
import { ContextoMaestroLeads, EstadoMaestroLeads } from "./diseño.ts";
import { activarLead, cambiarLeadEnLista, desactivarLeadActivo, incluirLeadEnLista, quitarLeadDeLista, recargarLeads } from "./maestro.ts";

export const getMaquina: () => Maquina<EstadoMaestroLeads, ContextoMaestroLeads> = () => {
    return {
        INICIAL: {
            lead_cambiado: cambiarLeadEnLista,

            lead_seleccionado: activarLead,

            lead_deseleccionado: desactivarLeadActivo,

            lead_borrado: quitarLeadDeLista,

            recarga_de_leads_solicitada: recargarLeads,

            creacion_de_lead_solicitada: "CREANDO",
        },
        CREANDO: {
            creacion_lead_cancelada: "INICIAL",

            lead_creado: [incluirLeadEnLista, activarLead, "INICIAL"],
        }
    }
}
