import { Maquina } from "@olula/lib/diseño.ts";
import { publicar } from "@olula/lib/dominio.ts";
import { cargarContexto, refrescarArticulo } from "./detalle.ts";
import { ContextoDetalleArticulo, EstadoDetalleArticulo } from "./diseño.ts";

export const getMaquina: () => Maquina<EstadoDetalleArticulo, ContextoDetalleArticulo> = () => ({
    INICIAL: {
        articulo_id_cambiado: [cargarContexto],
        articulo_deseleccionado: [publicar("articulo_deseleccionado", null)],
    },

    ABIERTO: {
        articulo_id_cambiado: [cargarContexto],
        articulo_deseleccionado: [publicar("articulo_deseleccionado", null)],
        publicacion_guardada: [refrescarArticulo],
        textos_guardados: [refrescarArticulo],
        categorias_guardadas: [refrescarArticulo],
        quitar_publicacion_solicitada: "QUITANDO",
    },

    QUITANDO: {
        publicacion_quitada: [refrescarArticulo, "ABIERTO"],
        quitar_cancelado: "ABIERTO",
        articulo_id_cambiado: [cargarContexto],
    },
});
