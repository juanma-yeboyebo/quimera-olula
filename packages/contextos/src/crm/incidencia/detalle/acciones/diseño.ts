import { Accion } from "#/crm/accion/diseño.ts";
import { ListaEntidades } from "@olula/lib/ListaEntidades.js";

export type EstadoAccionesIncidencia = "INICIAL" | "CREANDO" | "BORRANDO";

export type ContextoAccionesIncidencia = {
    estado: EstadoAccionesIncidencia;
    acciones: ListaEntidades<Accion>;
};