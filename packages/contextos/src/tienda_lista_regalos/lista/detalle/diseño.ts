import { ListaEntidades } from "@olula/lib/ListaEntidades.js";
import { LineaListaRegalos, ListaRegalos } from "../diseño.ts";

export type EstadoDetalleListaRegalos =
    | "INICIAL"
    | "ABIERTO"
    | "BORRANDO"
    | "CREANDO_LINEA"
    | "CAMBIANDO_LINEA"
    | "BORRANDO_LINEA";

export type ContextoDetalleListaRegalos = {
    estado: EstadoDetalleListaRegalos;
    lista: ListaRegalos;
    lineas: ListaEntidades<LineaListaRegalos>;
};
