import { Maquina } from "@olula/lib/diseño.js";
import { publicar } from "@olula/lib/dominio.js";
import { cambiarAccion, cargarContexto, getContextoVacio, refrescarAccion } from "./detalle.ts";
import { ContextoDetalleAccion, EstadoDetalleAccion } from "./diseño.ts";

export const getMaquina: () => Maquina<EstadoDetalleAccion, ContextoDetalleAccion> = () => {
    return {
        INICIAL: {
            accion_id_cambiada: cargarContexto,

            accion_cambiada: cambiarAccion,

            edicion_accion_cancelada: [getContextoVacio, publicar("accion_deseleccionada", null)],

            borrado_accion_solicitado: "BORRANDO",

            finalizacion_accion_solicitada: "FINALIZANDO",
        },
        BORRANDO: {
            borrado_accion_cancelado: "INICIAL",

            accion_borrada: [getContextoVacio, publicar('accion_borrada', (_, accionId) => accionId)],
        },
        FINALIZANDO: {
            finalizado_accion_cancelado: "INICIAL",

            accion_finalizada: [refrescarAccion, "INICIAL"],
        },
    }
}
