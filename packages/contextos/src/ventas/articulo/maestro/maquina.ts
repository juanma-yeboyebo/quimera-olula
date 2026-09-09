import { Maquina } from "@olula/lib/diseño.js";
import { ContextoMaestroArticulo, EstadoMaestroArticulo } from "./diseño.ts";
import { ampliarArticulos, Articulos, recargarArticulos } from "./dominio.ts";

export const getMaquina: () => Maquina<EstadoMaestroArticulo, ContextoMaestroArticulo> = () => ({
    INICIAL: {
        articulo_seleccionado: [Articulos.activar],
        articulo_deseleccionado: Articulos.desactivar,
        articulo_cambiado: [Articulos.cambiar],
        recarga_de_articulos_solicitada: recargarArticulos,
        criteria_cambiado: [Articulos.filtrar, recargarArticulos],
        siguiente_pagina: [Articulos.filtrar, ampliarArticulos],
        articulo_creado: Articulos.incluir,
        creacion_solicitada: "CREANDO_ARTICULO",
    },

    CREANDO_ARTICULO: {
        articulo_creado: [Articulos.incluir, "INICIAL"],
        creacion_cancelada: "INICIAL",
    },
});
