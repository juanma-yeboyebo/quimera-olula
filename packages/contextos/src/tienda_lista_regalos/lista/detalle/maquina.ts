import { Maquina } from "@olula/lib/diseño.ts";
import { publicar } from "@olula/lib/dominio.ts";
import {
    bajarLinea,
    cargarContexto,
    Lineas,
    onLineaBorrada,
    onLineaCambiada,
    onLineaCreada,
    refrescarLista,
    subirLinea,
} from "./detalle.ts";
import { ContextoDetalleListaRegalos, EstadoDetalleListaRegalos } from "./diseño.ts";

export const getMaquina: () => Maquina<EstadoDetalleListaRegalos, ContextoDetalleListaRegalos> = () => ({
    INICIAL: {
        lista_id_cambiado: [cargarContexto],
        lista_deseleccionada: [publicar("lista_deseleccionada", null)],
    },

    ABIERTO: {
        lista_id_cambiado: [cargarContexto],
        lista_deseleccionada: [publicar("lista_deseleccionada", null)],
        lista_guardada: [refrescarLista],
        borrado_solicitado: "BORRANDO",
        alta_linea_solicitada: "CREANDO_LINEA",
        linea_seleccionada: [Lineas.activar, "CAMBIANDO_LINEA"],
        baja_linea_solicitada: [Lineas.activar, "BORRANDO_LINEA"],
        subir_linea_solicitado: [subirLinea],
        bajar_linea_solicitado: [bajarLinea],
    },

    BORRANDO: {
        lista_borrada: [publicar("lista_borrada", null), "INICIAL"],
        borrado_cancelado: "ABIERTO",
    },

    CREANDO_LINEA: {
        linea_creada: [onLineaCreada, "ABIERTO"],
        alta_de_linea_cancelada: "ABIERTO",
    },

    CAMBIANDO_LINEA: {
        linea_cambiada: [onLineaCambiada, "ABIERTO"],
        cambio_de_linea_cancelado: "ABIERTO",
    },

    BORRANDO_LINEA: {
        linea_borrada: [onLineaBorrada, "ABIERTO"],
        borrado_de_linea_cancelado: "ABIERTO",
    },
});
