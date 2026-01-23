import { ListaEntidades } from "@olula/lib/ListaEntidades.js";
import { Incidencia } from "../diseño.ts";

export type EstadoMaestroIncidencias = "INICIAL" | "CREANDO";

export type ContextoMaestroIncidencias = {
    estado: EstadoMaestroIncidencias;
    incidencias: ListaEntidades<Incidencia>;
};