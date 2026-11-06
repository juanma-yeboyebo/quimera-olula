import { Maquina } from "@olula/lib/diseño.ts";
import { ContextoCatalogo, EstadoCatalogo } from "../diseño.ts";
import { cargarCatalogo, filtrosCambiados, siguientePagina } from "./maestro.ts";

export const getMaquina: () => Maquina<EstadoCatalogo, ContextoCatalogo> = () => ({
    CARGANDO: {
        filtros_cambiados: [filtrosCambiados],
    },
    LISTO: {
        filtros_cambiados: [filtrosCambiados],
        siguiente_pagina: [siguientePagina],
    },
    ERROR: {
        filtros_cambiados: [filtrosCambiados],
        reintentar: ["CARGANDO", cargarCatalogo],
    },
});
