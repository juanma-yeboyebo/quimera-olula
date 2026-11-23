import { Maquina } from "@olula/lib/diseño.js";
import { ContextoMaestroPedido, EstadoMaestroPedido } from "./diseño.ts";
import { Pedidos, albaranarPedidos, ampliarPedidos, facturarPedidos, recargarPedidos } from "./maestro.ts";


export const getMaquina: () => Maquina<EstadoMaestroPedido, ContextoMaestroPedido> = () => {

    return {

        INICIAL: {

            pedido_cambiado: Pedidos.cambiar,

            pedido_seleccionado: [Pedidos.activar],

            pedido_deseleccionado: Pedidos.desactivar,

            pedido_borrado: Pedidos.quitar,

            pedido_creado: Pedidos.incluir,

            recarga_de_pedidos_solicitada: recargarPedidos,

            criteria_cambiado: [Pedidos.filtrar, recargarPedidos],

            siguiente_pagina: [Pedidos.filtrar, ampliarPedidos],

            crear_pedido_solicitado: "CREANDO_PEDIDO",

            seleccionados_cambiados: async (ctx, payload) => ({ ...ctx, seleccionados: payload as string[] }),

            albaranado_multiple_solicitado: "ALBARANANDO_PEDIDOS",

            facturado_multiple_solicitado: "FACTURANDO_PEDIDOS",
        },

        CREANDO_PEDIDO: {

            pedido_creado: [Pedidos.incluir, Pedidos.activar, 'INICIAL'],

            creacion_pedido_cancelada: "INICIAL",
        },

        ALBARANANDO_PEDIDOS: {

            pedidos_albaranados: [albaranarPedidos],

            albaranado_multiple_cancelado: "INICIAL",
        },

        ALBARANES_CREADOS: {

            resultado_albaranado_cerrado: "INICIAL",
        },

        FACTURANDO_PEDIDOS: {

            pedidos_facturados: [facturarPedidos],

            facturado_multiple_cancelado: "INICIAL",
        },

        FACTURAS_CREADAS: {

            resultado_facturado_cerrado: "INICIAL",
        },
    }
}
