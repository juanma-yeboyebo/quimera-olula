import { ListaActivaEntidades } from "@olula/lib/ListaActivaEntidades.js";
import { FiltrosListaRegalos, ItemListaRegalos } from "../diseño.ts";

export type EstadoMaestroListaRegalos = "INICIAL" | "CREANDO";

export type ContextoMaestroListaRegalos = {
    estado: EstadoMaestroListaRegalos;
    listas: ListaActivaEntidades<ItemListaRegalos>;
    filtros: FiltrosListaRegalos;
};
