import { ListaActivaEntidades } from "@olula/lib/ListaActivaEntidades.js";
import { ItemPedidoCompra } from "../diseño.ts";

/**
 * Estados posibles del maestro.
 * Solo lectura: un único estado INICIAL para navegación.
 */
export type EstadoMaestroPedidoCompra = "INICIAL";

/**
 * Contexto del maestro (listado de pedidos de compra)
 */
export type ContextoMaestroPedidoCompra = {
    estado: EstadoMaestroPedidoCompra;
    pedidos: ListaActivaEntidades<ItemPedidoCompra>;
};
