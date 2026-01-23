import { Maquina } from "@olula/lib/diseño.js";
import { publicar } from "@olula/lib/dominio.js";
import { cambiarEstadoOportunidad, cargarContexto, getContextoVacio, onEstadoOportunidadBorrado } from "./detalle.ts";
import { ContextoDetalleEstadoOportunidad, EstadoDetalleEstadoOportunidad } from "./diseño.ts";

export const getMaquina: () => Maquina<EstadoDetalleEstadoOportunidad, ContextoDetalleEstadoOportunidad> = () => {
    return {
        INICIAL: {
            estado_oportunidad_id_cambiado: cargarContexto,

            estado_oportunidad_cambiado: cambiarEstadoOportunidad,

            edicion_estado_oportunidad_cancelada: [getContextoVacio, publicar("estado_oportunidad_deseleccionado", null)],

            borrado_estado_oportunidad_solicitado: "BORRANDO",
        },
        BORRANDO: {
            borrado_estado_oportunidad_cancelado: "INICIAL",

            estado_oportunidad_borrado: onEstadoOportunidadBorrado,
        },
    }
}
