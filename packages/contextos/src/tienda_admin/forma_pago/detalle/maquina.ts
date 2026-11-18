import { Maquina } from "@olula/lib/diseño.ts";
import { publicar } from "@olula/lib/dominio.ts";
import { cargarContexto, refrescarForma } from "./detalle.ts";
import { ContextoDetalleFormaPago, EstadoDetalleFormaPago } from "./diseño.ts";

export const getMaquina: () => Maquina<EstadoDetalleFormaPago, ContextoDetalleFormaPago> = () => ({
    INICIAL: {
        forma_pago_id_cambiado: [cargarContexto],
        forma_pago_deseleccionada: [publicar("forma_pago_deseleccionada", null)],
    },

    ABIERTO: {
        forma_pago_id_cambiado: [cargarContexto],
        forma_pago_deseleccionada: [publicar("forma_pago_deseleccionada", null)],
        forma_pago_guardada: [refrescarForma],
        conexion_comprobada: [refrescarForma],
    },
});
