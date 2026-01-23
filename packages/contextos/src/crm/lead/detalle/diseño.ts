import { Lead } from "../diseño.ts";

export type EstadoDetalleLead = "INICIAL" | "BORRANDO" | "CREANDO_OPORTUNIDAD" | "BORRANDO_OPORTUNIDAD" | "CREANDO_ACCION" | "BORRANDO_ACCION";

export type ContextoDetalleLead = {
    estado: EstadoDetalleLead;
    lead: Lead;
    inicial: Lead;
};