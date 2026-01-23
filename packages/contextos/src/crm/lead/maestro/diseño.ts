import { Lead } from "../diseño.ts";

export type EstadoMaestroLeads = "INICIAL" | "CREANDO";

export type ContextoMaestroLeads = {
    estado: EstadoMaestroLeads;
    leads: Lead[];
    totalLeads: number;
    activo: Lead | null;
};