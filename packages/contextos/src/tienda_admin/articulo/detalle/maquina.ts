import { Maquina } from "@olula/lib/diseño.ts";
import { publicar } from "@olula/lib/dominio.ts";
import {
    activarFoto,
    activarPublicacion,
    cargarContexto,
    desactivarFoto,
    desactivarPublicacion,
    marcarFotoPrincipal,
    ordenarFotos,
    refrescarArticulo,
} from "./detalle.ts";
import { ContextoDetalleArticulo, EstadoDetalleArticulo } from "./diseño.ts";

export const getMaquina: () => Maquina<EstadoDetalleArticulo, ContextoDetalleArticulo> = () => ({
    INICIAL: {
        articulo_id_cambiado: [cargarContexto],
        articulo_deseleccionado: [publicar("articulo_deseleccionado", null)],
    },

    ABIERTO: {
        articulo_id_cambiado: [cargarContexto],
        articulo_deseleccionado: [publicar("articulo_deseleccionado", null)],
        publicacion_solicitada: [activarPublicacion],
        textos_guardados: [refrescarArticulo],
        categorias_guardadas: [refrescarArticulo],
        fotos_subidas: [refrescarArticulo],
        borrar_foto_solicitado: [activarFoto],
        fotos_ordenadas: [ordenarFotos, refrescarArticulo],
        foto_principal_solicitada: [marcarFotoPrincipal, refrescarArticulo],
    },

    PUBLICANDO: {
        publicacion_guardada: [desactivarPublicacion, refrescarArticulo],
        publicacion_cancelada: [desactivarPublicacion],
        quitar_publicacion_solicitada: "QUITANDO",
        articulo_id_cambiado: [cargarContexto],
    },

    QUITANDO: {
        publicacion_quitada: [desactivarPublicacion, refrescarArticulo],
        quitar_cancelado: "PUBLICANDO",
        articulo_id_cambiado: [cargarContexto],
    },

    BORRANDO_FOTO: {
        foto_borrada: [desactivarFoto, refrescarArticulo],
        borrado_foto_cancelado: [desactivarFoto],
        articulo_id_cambiado: [cargarContexto],
    },
});
