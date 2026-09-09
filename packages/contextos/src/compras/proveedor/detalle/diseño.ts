import { ListaActivaEntidades } from "@olula/lib/ListaActivaEntidades.ts";
import { ListaEntidades } from "@olula/lib/ListaEntidades.ts";
import { ArticuloProveedor } from "../../articulo_proveedor/diseño.ts";
import { CuentaBancoProveedor, DireccionProveedor, Proveedor } from "../diseño.ts";

export type EstadoDetalleProveedor =
    | 'INICIAL'
    | 'ABIERTO'
    | 'BORRANDO'
    | 'CREANDO_DIRECCION'
    | 'CAMBIANDO_DIRECCION'
    | 'BORRANDO_DIRECCION'
    | 'CREANDO_CUENTA'
    | 'CAMBIANDO_CUENTA'
    | 'BORRANDO_CUENTA';

export type ContextoDetalleProveedor = {
    estado: EstadoDetalleProveedor;
    proveedor: Proveedor;
    direcciones: ListaEntidades<DireccionProveedor>;
    cuentas: ListaEntidades<CuentaBancoProveedor>;
    articulos: ListaActivaEntidades<ArticuloProveedor>;
};
