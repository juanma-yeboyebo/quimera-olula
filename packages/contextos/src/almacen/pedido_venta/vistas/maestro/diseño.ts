import { ListaActivaEntidades } from "@olula/lib/ListaActivaEntidades.js";
import { ItemPedidoVenta } from "../../diseño.ts";

export type EstadoMaestroPedidoVenta = 'INICIAL' | 'GENERANDO_SALIDA';

export type ContextoMaestroPedidoVenta = {
    estado: EstadoMaestroPedidoVenta;
    pedidos: ListaActivaEntidades<ItemPedidoVenta>;
    seleccionadas: string[];
};
