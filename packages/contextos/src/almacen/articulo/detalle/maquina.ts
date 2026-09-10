import { Maquina } from "@olula/lib/diseño.js";
import { publicar } from "@olula/lib/dominio.js";
import { ContextoArticulo, EstadoArticulo } from "./diseño.ts";
import {
    alternarCompra,
    alternarVenta,
    borrarArticulo,
    cargarContexto,
    getContextoVacio,
    refrescarArticulo,
} from "./dominio.ts";

export const getMaquina: () => Maquina<EstadoArticulo, ContextoArticulo> = () => ({
    INICIAL: {
        articulo_id_cambiado: [cargarContexto],

        articulo_deseleccionado: [
            getContextoVacio,
            publicar("articulo_deseleccionado", null),
        ],
    },

    ABIERTO: {
        articulo_id_cambiado: [cargarContexto],

        articulo_guardado: [refrescarArticulo],

        venta_alternada_solicitada: [alternarVenta],

        compra_alternada_solicitada: [alternarCompra],

        articulo_deseleccionado: [
            getContextoVacio,
            publicar("articulo_deseleccionado", null),
        ],

        borrado_solicitado: "BORRANDO_ARTICULO",
    },

    BORRANDO_ARTICULO: {
        borrado_de_articulo_listo: borrarArticulo,

        borrado_cancelado: "ABIERTO",
    },
});
