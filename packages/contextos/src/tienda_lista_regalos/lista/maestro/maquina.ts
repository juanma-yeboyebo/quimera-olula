import { Maquina } from "@olula/lib/diseño.ts";
import { ContextoMaestroListaRegalos, EstadoMaestroListaRegalos } from "./diseño.ts";
import * as maestro from "./maestro.ts";

export const getMaquina: () => Maquina<EstadoMaestroListaRegalos, ContextoMaestroListaRegalos> = () => ({
    INICIAL: {
        lista_seleccionada: [maestro.Listas.activar],
        lista_deseleccionada: [maestro.Listas.desactivar],
        lista_cambiada: [maestro.Listas.cambiar],
        lista_borrada: [maestro.Listas.quitar],
        website_cambiado: [maestro.cambiarWebsite, maestro.recargarListas],
        filtros_cambiados: [maestro.cambiarFiltros, maestro.recargarListas],
        criteria_cambiado: [maestro.Listas.filtrar, maestro.recargarListas],
        siguiente_pagina: [maestro.Listas.filtrar, maestro.ampliarListas],
        crear_lista_solicitado: "CREANDO",
    },

    CREANDO: {
        alta_de_lista_cancelada: "INICIAL",
        lista_creada: maestro.incluirListaCreadaPorId,
    },
});
