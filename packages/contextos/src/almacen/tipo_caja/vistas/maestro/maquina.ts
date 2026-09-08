import { Maquina } from "@olula/lib/diseño.ts";
import { ListaActivaEntidades } from "@olula/lib/ListaActivaEntidades.js";
import { TipoCaja } from "../../diseño.js";
import * as maestro from "./maestro.js";

/**
 * Estados posibles del maestro.
 */
export type EstadoMaestroTipoCaja = "INICIAL" | "CREANDO";

/**
 * Contexto del maestro (listado de tipos de caja)
 */
export type ContextoMaestroTipoCaja = {
    estado: EstadoMaestroTipoCaja;
    tiposCaja: ListaActivaEntidades<TipoCaja>;
};

export const getMaquina: () => Maquina<EstadoMaestroTipoCaja, ContextoMaestroTipoCaja> = () => {
    return {
        INICIAL: {
            // Selección de entidades
            tipo_caja_seleccionado: [maestro.TiposCaja.activar],
            tipo_caja_deseleccionado: [maestro.TiposCaja.desactivar],

            // Sincronización con detalle
            tipo_caja_cambiado: [maestro.TiposCaja.cambiar],
            tipo_caja_borrado: [maestro.TiposCaja.quitar],

            // Recarga completa (al montar o cambiar filtros)
            recarga_de_tipos_caja_solicitada: maestro.recargarTiposCaja,

            // Cambio de criteria → actualiza criteria en lista y recarga desde cero
            criteria_cambiado: [maestro.TiposCaja.filtrar, maestro.recargarTiposCaja],

            // Paginación incremental → actualiza criteria y añade al final de la lista
            siguiente_pagina: [maestro.TiposCaja.filtrar, maestro.ampliarTiposCaja],

            // Abrir modal de creación
            crear_tipo_caja_solicitado: "CREANDO",
        },

        CREANDO: {
            // Cancelar creación → volver al listado
            alta_de_tipo_caja_cancelada: "INICIAL",

            // Tipo de caja creado por el modal → obtener entidad e incluir en lista
            tipo_caja_creado: maestro.incluirTipoCajaCreado,
        },
    };
};
