import { Accion } from "../diseño.ts";

export type EstadoDetalleAccion = "INICIAL" | "BORRANDO" | "FINALIZANDO";

export type ContextoDetalleAccion = {
    estado: EstadoDetalleAccion;
    accion: Accion;
    inicial: Accion;
};