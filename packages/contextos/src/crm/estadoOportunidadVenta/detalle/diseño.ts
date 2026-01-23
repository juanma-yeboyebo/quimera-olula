import { EstadoOportunidad } from "../diseño.ts";

export type EstadoDetalleEstadoOportunidad = "INICIAL" | "BORRANDO";

export type ContextoDetalleEstadoOportunidad = {
    estado: EstadoDetalleEstadoOportunidad;
    estado_oportunidad: EstadoOportunidad;
    inicial: EstadoOportunidad;
};