import { NodoCategoria } from "../../categoria/diseño.ts";
import { ArticuloWebDetalle, ImagenArticulo } from "../diseño.ts";

export type EstadoDetalleArticulo = "INICIAL" | "ABIERTO" | "PUBLICANDO" | "QUITANDO" | "BORRANDO_FOTO";

export type ContextoDetalleArticulo = {
    estado: EstadoDetalleArticulo;
    articulo: ArticuloWebDetalle;
    websiteId: number | null;
    arbol: NodoCategoria[];
    fotoActiva: ImagenArticulo | null;
    websitePublicacion: number | null;
};

export type PayloadCargaArticulo = {
    id?: string;
    websiteId: number | null;
};
