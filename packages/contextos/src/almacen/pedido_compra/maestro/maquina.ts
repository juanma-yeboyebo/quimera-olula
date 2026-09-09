import { Maquina } from "@olula/lib/diseño.ts";
import { ContextoMaestroPedidoCompra, EstadoMaestroPedidoCompra } from "./diseño.ts";
import * as maestro from "./maestro.ts";

export const getMaquina: () => Maquina<EstadoMaestroPedidoCompra, ContextoMaestroPedidoCompra> = () => {
    return {
        INICIAL: {
            // Selección de pedidos
            pedido_seleccionado: [maestro.Pedidos.activar],
            pedido_deseleccionado: [maestro.Pedidos.desactivar],

            // Recarga completa (al montar o cambiar filtros)
            recarga_de_pedidos_solicitada: maestro.recargarPedidos,

            // Cambio de criteria → actualiza criteria en lista y recarga desde cero
            criteria_cambiado: [maestro.Pedidos.filtrar, maestro.recargarPedidos],

            // Paginación incremental → actualiza criteria y añade al final de la lista
            siguiente_pagina: [maestro.Pedidos.filtrar, maestro.ampliarPedidos],
        },
    };
};
