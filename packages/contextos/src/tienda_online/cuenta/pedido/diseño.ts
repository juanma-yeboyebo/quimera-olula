import { PedidoDetalle } from "../diseño.ts";

export type EstadoPedido = "CARGANDO" | "LISTO" | "NO_ENCONTRADO" | "ERROR";

export type ContextoPedido = {
    estado: EstadoPedido;
    pedido: PedidoDetalle | null;
};
