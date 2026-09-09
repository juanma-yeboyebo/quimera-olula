import { Maquina } from "@olula/lib/diseño.js";
import { ContextoMaestroVentaTpv, EstadoMaestroVentaTpv } from "./diseño.ts";
import { Ventas, ampliarVentas, recargarVentas } from "./maestro.ts";


export const getMaquina: () => Maquina<EstadoMaestroVentaTpv, ContextoMaestroVentaTpv> = () => {

    return {

        INICIAL: {

            venta_cambiada: Ventas.cambiar,

            venta_seleccionada: [Ventas.activar],

            venta_deseleccionada: Ventas.desactivar,

            venta_borrada: [Ventas.quitar, Ventas.desactivar],

            venta_creada: Ventas.incluir,

            recarga_de_ventas_solicitada: recargarVentas,

            criteria_cambiado: [Ventas.filtrar, recargarVentas],

            siguiente_pagina: [Ventas.filtrar, ampliarVentas],

            crear_venta_solicitada: "CREANDO_VENTA",

            seleccionados_cambiados: async (ctx, payload) => ({ ...ctx, seleccionados: payload as string[] }),
        },

        CREANDO_VENTA: {

            venta_creada: [Ventas.incluir, Ventas.activar, 'INICIAL'],

            creacion_venta_cancelada: "INICIAL",
        },
    }
}
