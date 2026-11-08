import { NodoCategoria } from "../../categoria/diseño.ts";
import { ArticuloWebDetalle } from "../diseño.ts";

export type EstadoDetalleArticulo = "INICIAL" | "ABIERTO" | "QUITANDO";

export type ContextoDetalleArticulo = {
    estado: EstadoDetalleArticulo;
    articulo: ArticuloWebDetalle;
    websiteId: number | null;
    arbol: NodoCategoria[];
};

export type PayloadCargaArticulo = {
    id?: string;
    websiteId: number | null;
};
