import { OportunidadVenta } from "../diseño.ts";

export type EstadoMaestroOportunidades = "INICIAL" | "CREANDO";

export type ContextoMaestroOportunidades = {
    estado: EstadoMaestroOportunidades;
    oportunidades: OportunidadVenta[];
    totalOportunidades: number;
    activa: OportunidadVenta | null;
};