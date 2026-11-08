import { Maquina } from "@olula/lib/diseño.ts";
import { publicar } from "@olula/lib/dominio.ts";
import { cargarCategoria, vaciarCategoria } from "./detalle.ts";
import { ContextoDetalleCategoria, EstadoDetalleCategoria } from "./diseño.ts";

export const getMaquina: () => Maquina<EstadoDetalleCategoria, ContextoDetalleCategoria> = () => ({
    INICIAL: {
        categoria_cambiada: [cargarCategoria],
    },

    ABIERTO: {
        categoria_cambiada: [cargarCategoria],
        categoria_guardada: [publicar("categoria_guardada", null)],
        subcategoria_solicitada: [publicar<EstadoDetalleCategoria, ContextoDetalleCategoria>("alta_solicitada", (contexto) => contexto.categoria.id)],
        borrar_solicitado: "BORRANDO",
        cierre_solicitado: [publicar("categoria_deseleccionada", null)],
    },

    BORRANDO: {
        categoria_borrada: [vaciarCategoria, publicar("categoria_borrada", null)],
        borrado_cancelado: "ABIERTO",
    },
});
