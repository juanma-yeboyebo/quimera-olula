import { ListaActivaEntidades } from "@olula/lib/ListaActivaEntidades.js";
import { ArticuloWeb, FiltrosArticulo } from "../diseño.ts";

export type EstadoMaestroArticulo = "INICIAL";

export type OpcionCategoriaFiltro = { valor: string; descripcion: string };

export type ContextoMaestroArticulo = {
    estado: EstadoMaestroArticulo;
    articulos: ListaActivaEntidades<ArticuloWeb>;
    filtros: FiltrosArticulo;
    opcionesCategoria: OpcionCategoriaFiltro[];
};
