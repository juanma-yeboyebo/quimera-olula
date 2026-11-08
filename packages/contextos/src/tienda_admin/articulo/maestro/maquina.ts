import { Maquina } from "@olula/lib/diseño.ts";
import { ContextoMaestroArticulo, EstadoMaestroArticulo } from "./diseño.ts";
import * as maestro from "./maestro.ts";

export const getMaquina: () => Maquina<EstadoMaestroArticulo, ContextoMaestroArticulo> = () => ({
    INICIAL: {
        articulo_seleccionado: [maestro.Articulos.activar],
        articulo_deseleccionado: [maestro.Articulos.desactivar],
        articulo_cambiado: [maestro.Articulos.cambiar],
        website_cambiado: [maestro.cambiarWebsite, maestro.recargarArticulos],
        filtros_cambiados: [maestro.cambiarFiltros, maestro.recargarArticulos],
        criteria_cambiado: [maestro.Articulos.filtrar, maestro.recargarArticulos],
        siguiente_pagina: [maestro.Articulos.filtrar, maestro.ampliarArticulos],
    },
});
