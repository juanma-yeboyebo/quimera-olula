import { ListaActivaEntidades } from "@olula/lib/ListaActivaEntidades.js";
import { Articulo } from "../diseño.ts";

export type EstadoMaestroArticulo = "INICIAL";

export type ContextoMaestroArticulo = {
    estado: EstadoMaestroArticulo;
    articulos: ListaActivaEntidades<Articulo>;
};
