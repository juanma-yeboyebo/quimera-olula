import { Maquina } from "@olula/lib/diseño.ts";
import { publicar } from "@olula/lib/dominio.ts";
import { TipoCaja } from "../../diseño.js";
import { cargarContexto, refrescarTipoCaja } from "./detalle.js";

/**
 * Estados posibles en la vista de detalle.
 */
export type EstadoDetalleTipoCaja =
    | "INICIAL"
    | "ABIERTO"
    | "BORRANDO"
    | "CAMBIANDO_SKU";

/**
 * Contexto del detalle (edición de un tipo de caja)
 */
export type ContextoDetalleTipoCaja = {
    estado: EstadoDetalleTipoCaja;
    tipoCaja: TipoCaja;
};

export const getMaquina: () => Maquina<EstadoDetalleTipoCaja, ContextoDetalleTipoCaja> = () => {
    return {
        INICIAL: {
            // Cuando llega un nuevo ID (por prop del maestro)
            tipo_caja_id_cambiado: [cargarContexto],

            // Cuando se deselecciona desde el maestro
            tipo_caja_deseleccionado: [
                publicar("tipo_caja_deseleccionado", null),
            ],
        },

        ABIERTO: {
            // Cambio guardado en API (por auto-guardado de useModelo)
            tipo_caja_guardado: [refrescarTipoCaja],

            // Activar modal de borrado
            borrado_solicitado: "BORRANDO",

            // Activar modal de cambio de SKU
            cambio_de_sku_solicitado: "CAMBIANDO_SKU",

            // El detalle puede recargar la entidad (ej. tras acción externa)
            tipo_caja_id_cambiado: [cargarContexto],
        },

        BORRANDO: {
            // El modal confirmó el borrado; notifica al maestro y limpia el contexto
            tipo_caja_borrado: [
                publicar("tipo_caja_borrado", null),
                "INICIAL",
            ],

            // El modal canceló
            borrado_de_tipo_caja_cancelado: "ABIERTO",
        },

        CAMBIANDO_SKU: {
            // SKU actualizado con éxito → refrescar y volver a ABIERTO
            sku_tipo_caja_cambiado: [refrescarTipoCaja, "ABIERTO"],

            // Modal cancelado → volver a ABIERTO
            cambio_de_sku_cancelado: "ABIERTO",
        },
    };
};
