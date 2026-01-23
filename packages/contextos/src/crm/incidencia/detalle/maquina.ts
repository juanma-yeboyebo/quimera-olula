import { Maquina } from "@olula/lib/diseño.js";
import { publicar } from "@olula/lib/dominio.js";
import { cambiarIncidencia, cargarContexto, getContextoVacio, onIncidenciaBorrada } from "./detalle.ts";
import { ContextoDetalleIncidencia, EstadoDetalleIncidencia } from "./diseño.ts";

export const getMaquina: () => Maquina<EstadoDetalleIncidencia, ContextoDetalleIncidencia> = () => {
    return {
        INICIAL: {
            incidencia_id_cambiado: cargarContexto,

            incidencia_cambiada: cambiarIncidencia,

            edicion_incidencia_cancelada: [getContextoVacio, publicar("incidencia_deseleccionada", null)],

            borrado_incidencia_solicitado: "BORRANDO",
        },
        BORRANDO: {
            borrado_incidencia_cancelado: "INICIAL",

            incidencia_borrada: onIncidenciaBorrada,
        },
    }
}
