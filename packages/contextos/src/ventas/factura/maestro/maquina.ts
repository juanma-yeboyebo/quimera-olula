import { Maquina } from "@olula/lib/diseño.js";
import { ContextoMaestroFactura, EstadoMaestroFactura } from "./diseño.ts";
import { ampliarFacturas, Facturas, recargarFacturas } from "./dominio.ts";


export const getMaquina: () => Maquina<EstadoMaestroFactura, ContextoMaestroFactura> = () => {

    return {

        INICIAL: {

            factura_cambiada: Facturas.cambiar,

            factura_seleccionada: [Facturas.activar],

            factura_deseleccionada: Facturas.desactivar,

            factura_borrada: Facturas.quitar,

            factura_creada: Facturas.incluir,

            recarga_de_facturas_solicitada: recargarFacturas,

            criteria_cambiado: [Facturas.filtrar, recargarFacturas],

            siguiente_pagina: [Facturas.filtrar, ampliarFacturas],

            crear_factura_solicitado: "CREANDO_FACTURA",
        },

        CREANDO_FACTURA: {

            factura_creada: [Facturas.incluir, 'INICIAL'],

            creacion_factura_cancelada: "INICIAL",
        },

    }
}
