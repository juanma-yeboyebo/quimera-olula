import { ListaActivaEntidades } from "@olula/lib/ListaActivaEntidades.ts";
import { Articulo } from "../diseño.ts";

export type EstadoMaestroArticulo = 'INICIAL';

export type ContextoMaestroArticulo = {
    estado: EstadoMaestroArticulo;
    articulos: ListaActivaEntidades<Articulo>;
};
