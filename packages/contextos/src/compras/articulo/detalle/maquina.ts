import { Maquina } from "@olula/lib/diseño.ts";
import { publicar } from "@olula/lib/dominio.ts";
import {
    cargarContexto,
    limpiarContexto,
    marcarPorDefectoProceso,
    Precios,
    refrescarArticulo,
    refrescarPrecios,
} from "./detalle.ts";
import { ContextoDetalleArticulo, EstadoDetalleArticulo } from "./diseño.ts";

export const getMaquina: () => Maquina<EstadoDetalleArticulo, ContextoDetalleArticulo> = () => {
    return {
        INICIAL: {
            articulo_id_cambiado: [cargarContexto],

            articulo_deseleccionado: [
                limpiarContexto,
                publicar('articulo_deseleccionado', null),
            ],
        },

        ABIERTO: {
            articulo_id_cambiado: [cargarContexto],

            articulo_guardado: [refrescarArticulo],

            articulo_deseleccionado: [
                limpiarContexto,
                publicar('articulo_deseleccionado', null),
            ],

            precio_seleccionado: [Precios.activar],
            alta_precio_solicitada: "CREANDO_PRECIO",
            cambio_precio_solicitado: "CAMBIANDO_PRECIO",
            baja_precio_solicitada: "BORRANDO_PRECIO",
            por_defecto_solicitado: [marcarPorDefectoProceso],
        },

        CREANDO_PRECIO: {
            precio_creado: [refrescarPrecios, "ABIERTO"],
            alta_de_precio_cancelada: "ABIERTO",
        },

        CAMBIANDO_PRECIO: {
            precio_cambiado: [refrescarPrecios, "ABIERTO"],
            cambio_de_precio_cancelado: "ABIERTO",
        },

        BORRANDO_PRECIO: {
            precio_borrado: [refrescarPrecios, "ABIERTO"],
            borrado_de_precio_cancelado: "ABIERTO",
        },
    };
};
