import { EstadoOportunidad } from "../diseño.ts";

export type EstadoMaestroEstadosOportunidad = "INICIAL" | "CREANDO";

export type ContextoMaestroEstadosOportunidad = {
    estado: EstadoMaestroEstadosOportunidad;
    estados_oportunidad: EstadoOportunidad[];
    totalEstadosOportunidad: number;
    activo: EstadoOportunidad | null;
};