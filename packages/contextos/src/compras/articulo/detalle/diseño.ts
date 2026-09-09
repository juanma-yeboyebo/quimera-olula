import { ListaEntidades } from "@olula/lib/ListaEntidades.ts";
import { ArticuloProveedor } from "../../articulo_proveedor/diseño.ts";
import { Articulo } from "../diseño.ts";

export type EstadoDetalleArticulo =
    | 'INICIAL'
    | 'ABIERTO'
    | 'CREANDO_PRECIO'
    | 'CAMBIANDO_PRECIO'
    | 'BORRANDO_PRECIO';

export type ContextoDetalleArticulo = {
    estado: EstadoDetalleArticulo;
    articulo: Articulo;
    precios: ListaEntidades<ArticuloProveedor>;
};
