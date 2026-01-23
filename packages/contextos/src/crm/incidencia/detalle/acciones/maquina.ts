import { Maquina } from "@olula/lib/diseño.js";
import { Acciones, recargarAcciones } from "./acciones.ts";
import { ContextoAccionesIncidencia, EstadoAccionesIncidencia } from "./diseño.ts";

export const getMaquina: () => Maquina<EstadoAccionesIncidencia, ContextoAccionesIncidencia> = () => {
    return {
        INICIAL: {
            accion_seleccionada: [Acciones.activar],

            recarga_de_acciones_solicitada: [recargarAcciones],

            creacion_de_accion_solicitada: "CREANDO",

            borrado_accion_solicitado: "BORRANDO",
        },
        CREANDO: {
            creacion_accion_cancelada: "INICIAL",

            accion_creada: [Acciones.incluir, Acciones.activar, "INICIAL"],
        },
        BORRANDO: {
            borrado_accion_cancelado: "INICIAL",

            accion_borrada: [Acciones.quitar, "INICIAL"],
        }
    }
}
