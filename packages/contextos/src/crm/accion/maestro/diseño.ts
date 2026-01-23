import { ListaEntidades } from "@olula/lib/ListaEntidades.js";
import { Accion } from "../diseño.ts";

export type EstadoMaestroAcciones = "INICIAL" | "CREANDO";

export type ContextoMaestroAcciones = {
    estado: EstadoMaestroAcciones;
    acciones: ListaEntidades<Accion>;
};