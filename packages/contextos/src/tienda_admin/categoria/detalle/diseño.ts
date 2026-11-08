import { NodoCategoria } from "../diseño.ts";

export type EstadoDetalleCategoria = "INICIAL" | "ABIERTO" | "BORRANDO";

export type ContextoDetalleCategoria = {
    estado: EstadoDetalleCategoria;
    categoria: NodoCategoria;
};
