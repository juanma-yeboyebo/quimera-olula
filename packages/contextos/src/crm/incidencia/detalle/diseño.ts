import { Incidencia } from "../diseño.ts";

export type EstadoDetalleIncidencia = "INICIAL" | "BORRANDO";

export type ContextoDetalleIncidencia = {
    estado: EstadoDetalleIncidencia;
    incidencia: Incidencia;
    inicial: Incidencia;
};