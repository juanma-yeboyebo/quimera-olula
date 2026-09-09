import { Maquina } from "@olula/lib/diseño.ts";
import { ContextoMaestroArticulo, EstadoMaestroArticulo } from "./diseño.ts";
import * as maestro from "./maestro.ts";

export const getMaquina: () => Maquina<EstadoMaestroArticulo, ContextoMaestroArticulo> = () => {
    return {
        INICIAL: {
            articulo_seleccionado: [maestro.Articulos.activar],
            articulo_deseleccionado: [maestro.Articulos.desactivar],

            articulo_cambiado: [maestro.Articulos.cambiar],

            recarga_de_articulos_solicitada: maestro.recargarArticulos,

            criteria_cambiado: [maestro.Articulos.filtrar, maestro.recargarArticulos],

            siguiente_pagina: [maestro.Articulos.filtrar, maestro.ampliarArticulos],

            articulo_creado: [maestro.Articulos.incluir],
            creacion_solicitada: "CREANDO_ARTICULO",
        },

        CREANDO_ARTICULO: {
            articulo_creado: [maestro.Articulos.incluir, "INICIAL"],
            creacion_cancelada: "INICIAL",
        },
    };
};
