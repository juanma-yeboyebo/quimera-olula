import { Maquina } from "@olula/lib/diseño.js";
import { ContextoMaestroEstadosOportunidad, EstadoMaestroEstadosOportunidad } from "./diseño.ts";
import { activarEstadoOportunidad, cambiarEstadoOportunidadEnLista, desactivarEstadoOportunidadActivo, incluirEstadoOportunidadEnLista, quitarEstadoOportunidadDeLista, recargarEstadosOportunidad } from "./maestro.ts";

export const getMaquina: () => Maquina<EstadoMaestroEstadosOportunidad, ContextoMaestroEstadosOportunidad> = () => {
    return {
        INICIAL: {
            estado_oportunidad_cambiado: cambiarEstadoOportunidadEnLista,

            estado_oportunidad_seleccionado: activarEstadoOportunidad,

            estado_oportunidad_deseleccionado: desactivarEstadoOportunidadActivo,

            estado_oportunidad_borrado: quitarEstadoOportunidadDeLista,

            recarga_de_estados_oportunidad_solicitada: recargarEstadosOportunidad,

            creacion_de_estado_oportunidad_solicitada: "CREANDO",
        },
        CREANDO: {
            creacion_estado_oportunidad_cancelada: "INICIAL",

            estado_oportunidad_creado: [incluirEstadoOportunidadEnLista, activarEstadoOportunidad, "INICIAL"],
        }
    }
}
